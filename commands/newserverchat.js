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


  // get merge_chat
  let aowChat = g.channels.find("name", "AoW Chats");
//  message.channel.send(`Merge chat: ${mChat.toString()}`);

//  let tgtRole = args[0];
  //message.channel.send(`Searching for role ${args[0]}...`);

  // Check if new role already exists
  let tgtRole = message.guild.roles.find("name", args[0]);
  if (!tgtRole) {
    message.channel.send(`Warning: Role for server #${args[0]} does not exist.`, {code:"asciidoc"});
  }
  // does new channel exist?
  let newChannel = message.guild.channels.find("name", args[0]);
  // If new channel does not exist, create new channel
  if(newChannel) {
    message.channel.send(`Channel already exists!`, {code:"asciidoc"});
  } else {
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
      , "Requested server channel")
      .then(updated => {
        console.log(updated.permissionOverwrites.get(tgtRole.id));
        updated.setParent(aowChat);
//        updated.setPosition(mBulletin.position + 1);
      })
      .catch(console.error);

    message.channel.send(`New server channel created!`, {code:"asciidoc"});
  };
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["nsc"],
  permLevel: "Moderator"
};

exports.help = {
  name: "newserverchat",
  category: "Merge Administration",
  description: "Create new server channel",
  usage: "newserverchat <server#>"
};
