exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);
//  let ndx = args.findIndex(function(element) {return element === "debug"});
//  message.channel.send(`Debug? ${ndx}`);
//  if(ndx >>> 0) {
//    args.splice(ndx, 1);
//  }


  if(args.length < 1) {
    message.channel.send("Error: missing arguments");
    return;
  }
  // ********** SETUP **********
  // get server
  let g = message.guild;
  if(debug) message.channel.send(`Server:: ${message.guild.name}`, {code:"asciidoc"});

  // get admin role
  let adminRole = g.roles.find("name", "Admin");
  if(debug) {
    if(adminRole) {
      message.channel.send(`Found role:: ${adminRole.name}`, {code:"asciidoc"});
    } else {
      message.channel.send(`Could not find role Admin ::`, {code:"asciidoc"});
    }
  }

  // get moderator role
  let moderatorRole = g.roles.find("name", "Moderator");
  if(debug) {
    if(moderatorRole) {
      message.channel.send(`Found role:: ${moderatorRole.name}`, {code:"asciidoc"});
    } else {
      message.channel.send(`Could not find role Moderator ::`, {code:"asciidoc"});
    }
  }

  // get bot role
  let botRole = g.roles.find("name", "bot");
  if(debug) {
    if(botRole) {
      message.channel.send(`Found role:: ${botRole.name}`, {code:"asciidoc"});
    } else {
      message.channel.send(`Could not find role bot ::`, {code:"asciidoc"});
    }
  }

  // get everyone role
  let everyoneRole = g.roles.find("name", "@everyone");
  if(debug) {
    if(everyoneRole) {
      message.channel.send(`Found role:: ${everyoneRole.name}`, {code:"asciidoc"});
    } else {
      message.channel.send(`Could not find role @everyone ::`, {code:"asciidoc"});
    }
  }
//  if(debug) message.channel.send(`Found role:: ${everyoneRole.name}`, {code:"asciidoc"});


  // get archive category
  let archiveChat = g.channels.find("name", "archive");
//  message.channel.send(`Merge chat: ${mChat.toString()}`);

  // get merge_chat
  let aowChat = g.channels.find("name", "AoW Chats");
//  message.channel.send(`Merge chat: ${mChat.toString()}`);

//  let tgtRole = args[0];
  //message.channel.send(`Searching for role ${args[0]}...`);

  // Check if new role already exists
  let tgtRole = message.guild.roles.find("name", args[0]);
  // If new role does not exist, create new role
  // - Default color, mentionable=true, hoist=true
  // - Move to top of roles list, right below @merging role
  if(!tgtRole) {
    message.channel.send(`Creating role ${args[0]}`, {code:"asciidoc"});
    // Create a new role with data
    tgtRole = message.guild.createRole({
      name: args[0],
      color: 'DEFAULT',
      mentionable: true,
      hoist: true,
      // create new role at top of server list (below @merging role)
      position: mergingRole.position + 1,
    })
      .then(role => console.log(`Created new role with name ${role.name} and color ${role.color}`))
      .catch(console.error)
    // Due to async timing, quit here and advise user to re-run the merge command
    message.channel.send(`Please re-run merge.`, {code:"asciidoc"});
    return;
  }

  // does new channel exist?
  let newChannel = message.guild.channels.find("name", tgtRole.name);
  // If new channel does not exist, create new channel
  if(!newChannel) {
    // Create new channel
    message.channel.send(`Creating channel ${tgtRole.name}`, {code:"asciidoc"});
    newChannel = message.guild.createChannel(tgtRole.name, 'text', [{
      id: tgtRole.id,
      allow: 0x400,
    },{
      id: adminRole.id,
      allow: 0x10000400,  // manage roles, view channel
    },{
      id: moderatorRole.id,
      allow: 0x400,
    },{
      id: botRole.id,
      allow: 0x10000410,  // manage roles, view channel, manage channels
    },{
      id: everyoneRole.id,
      deny: 0x400,
    }]
      , "merge")
      .then(updated => {
        console.log(updated.permissionOverwrites.get(tgtRole.id));
        updated.setParent(aowChat);
//        updated.setPosition(mBulletin.position + 1);
      })
      .catch(console.error);

  } else {
    let i = 0;
    // Overwrite permissions for new role
    newChannel.overwritePermissions(tgtRole, {
//      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(tgtRole.id));
        updated.setParent(aowChat);
      })
      .catch(console.error);
    newChannel.overwritePermissions(adminRole, {
//      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(adminRole.id));
      })
      .catch(console.error);
    newChannel.overwritePermissions(moderatorRole, {
//      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(moderatorRole.id));
      })
      .catch(console.error);
    newChannel.overwritePermissions(botRole, {
//      SEND_MESSAGES: true,
      VIEW_CHANNEL: true,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(botRole.id));
      })
      .catch(console.error);

    // Overwrite permissions for a message author
    message.channel.overwritePermissions(everyoneRole, {
      VIEW_CHANNEL: false,
    })
      .then(updated => {
        console.log(updated.permissionOverwrites.get(everyoneRole.id));
      })
      .catch(console.error);
  };


  // for each role listed in message
  args.forEach(function(arg) {
    if(arg !== args[0]) {

      let mRole = message.guild.roles.find("name", arg);
      if(!mRole) {
        message.channel.send(`Role ${arg} does not exist!`, {code:"asciidoc"});
      } else {
        message.channel.send(`Merging ${mRole.name} into ${tgtRole.name}`, {code:"asciidoc"});

        let membersWithRole = mRole.members;
        console.log(`Got ${membersWithRole.size} members with that role.`);

        // give all members the role tgtRole (@merging)
        membersWithRole.forEach(function(mem) {
          mem.addRole(tgtRole)
        });

        if(!newChannel) {
          newChannel.then(nc => {
            nc.setParent(aowChat);
            message.channel.send(`New server channel: ${nc.name}`, {code:"asciidoc"});
          });
        }
        else {
          newChannel.setParent(aowChat);
        }

        // archive old channel
        let oldChat = g.channels.find("name", arg);
//        message.channel.send(`Old Chat: ${oldChat.name}`, {code:"asciidoc"});

        if(oldChat) {
//        message.channel.send(`Old Chat: ${oldChat.name}`, {code:"asciidoc"});
//        message.channel.send(`Archive Chat: ${archiveChat.name}`, {code:"asciidoc"});
          oldChat.setParent(archiveChat);
          // final post in old server channel
          oldChat.sendMessage(`Server #${arg} has been merged into Server ${newChannel}! This channel is now set to read-only.`);
          mBulletin.sendMessage(`${mRole} Server #${arg} has been merged into Server ${newChannel}!`);

          // Remove write privileges to old server channel
          message.channel.overwritePermissions(mRole, {
            'SEND_MESSAGES': false,
          })
            .then(updated => {
              console.log(updated.permissionOverwrites.get(mRole.id));
            })
            .catch(console.error);
        }
  }
    };
  });


  message.channel.send(`Merge complete!`, {code:"asciidoc"});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "channel",
  category: "Merge Administration",
  description: "Create new server chat.",
  usage: "channel <server #>"
};
