exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);

  let tgtRole = message.guild.roles.find("name", "merging");

  // for each role mention in message
//  message.mentions.roles.forEach(function(arg) {
//    let mRole = arg;
    let mRole = tgtRole;
    let membersWithRole = mRole.members;
    console.log(`Got ${membersWithRole.size} members with that role.`);

    // give all members the role tgtRole (@merging)
    membersWithRole.forEach(function(mem) {
      mem.removeRole(mRole);
    });
    message.channel.send(`ALL users have been unflagged as @merging`);
//  });



};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "clearflag",
  category: "Merge Administration",
  description: "Remove @merging role from ALL users.",
  usage: "flag"
};
