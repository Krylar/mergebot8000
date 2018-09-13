exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);

  message.channel.send("Processing request. Please stand by...");


  // ********** SETUP **********
  // get merging role
  let tgtRole = message.guild.roles.find("name", "merging");
//    tgtRole.then(updated => message.channel.send(`Role (merging): ${tgtRole}`))
//    .catch(console.error);

  // get server
  let g = message.guild;
//    .then(updated => message.channel.send(`Server: ${g.name}`));
//  message.channel.send(`Server: ${message.guild.name}`);

  // get merge category
//  let mCategory = g.channels.find("name", "merge"); // no merge category on DoW
//    .then(updated => message.channel.send(`Category (Merge): ${mCategory.name}`));

//  message.channel.send(`Merge category: ${mCategory.toString()}`);

  // get merge_world_bulletin
  let mBulletin = g.channels.find("name", "merge_world_bulletin");
//    .then(updated => message.channel.send(`Channel (Bulletin): ${mBulletin}`));
//  message.channel.send(`Merge bulletin channel: ${mBulletin.toString()}`);

  // get merge_chat
  let mChat = g.channels.find("name", "merge_chat");
//    .then(updated => message.channel.send(`Channel (Merge): ${mChat}`));

//  message.channel.send(`Merge chat: ${mChat.toString()}`);


  // ********** LOOP FOR EACH SERVER **********
  args.forEach(function(arg) {
//    console.log("Moving channel");
    message.channel.send(`Processing ${arg}...`);
    // ********** MOVE CHANNEL **********
    let mChannel = client.channels.find("name", arg.toString());
    //let mChat = client.channels.find("name", "merge-chat");
//    message.channel.send(`Channel parent: ${mChannel.parent}`);

//    message.channel.send("  Moving channel to MERGE...");

//    mChannel.setParent(mCategory.id, "server merge announcement")
   //   .then(udpated => console.log("..parent updated")
//      .catch(console.error);
//    message.channel.send("  Moving channel to MERGE...");


    // ********** ADD MERGING ROLE **********
    // get role
    let mRole = message.guild.roles.find("name", arg.toString());
    //message.channel.send(`Looping for ${arg.toString()}`);

    // check if role exists
    if (!mRole) {
      message.channel.send(`Role for ${arg} does not exist! Skipping.`);
    } else {
      // get users with role
      let membersWithRole = mRole.members;
      //console.log(`Got ${membersWithRole.size} members with that role.`);

      // give all members the merging role
      membersWithRole.forEach(function(mem) {
        mem.addRole(tgtRole)
      });
      //message.channel.send(`Users with role ${mRole.toString()} have been flagged as @merging`);

      // ********** ANNOUNCEMENTS **********
      // Server channel
      if(mChannel) {
        mChannel.send(`Server ${mRole} has received a merge announcement! All members now have access to ${mChat.toString()} to prepare for merge!.`);
      }
      // merge bulletin
  //    mBulletin.send(`Merge announcement! Server ${arg.toString()} has been flagged for merge! @${arg.toString()}`);
      mBulletin.send(`Server ${mRole} has received a merge announcement! All members now have access to ${mChat.toString()} to prepare for merge!.`);
  }


  });

  message.channel.send("...done!");

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "flag",
  category: "Merge Administration",
  description: "Flags server @roles for merging",
  usage: "flag <server #>"
};
