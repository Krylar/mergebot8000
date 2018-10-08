exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);

  // ********** SETUP **********
  // get merging role
  let tgtRole = message.guild.roles.find(r => r.name == "merging");

  // get server
  let g = message.guild;

  // get merge_world_bulletin
  let mBulletin = await g.channels.find(c => c.name == "merge_world_bulletin");

  // get merge_chat
  let mChat = await g.channels.find(c => c.name == "merge_chat");

  // ********** LOOP FOR EACH SERVER **********
  args.forEach(async function(arg) {
//    message.channel.send(`Processing ${arg}...`);
    let mChannel = client.channels.find(c => c.name == arg.toString());
    let mRole = await message.guild.roles.find(r => r.name == arg.toString());

    // check if role exists
    if (!mRole) {
      message.channel.send(`Role for ${arg} does not exist! Skipping.`);
    } else {
      // give server role access to the #merge-chat
      mChat.overwritePermissions(mRole,{VIEW_CHANNEL: true});

      // ********** ANNOUNCEMENTS **********
      // Server channel
      if(mChannel) {
        mChannel.send(`Server ${mRole} has received a merge announcement! All members now have access to ${mChat.toString()} to prepare for merge!.`);
      }
      // merge bulletin
      mBulletin.send(`Server ${mRole} has received a merge announcement! All members now have access to ${mChat.toString()} to prepare for merge!.`);
    }
  }); // args.forEach
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
