exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);

/*  let tgtUser = message.member;
  if(message.member.id != 414664957171466241) // Lop
    tgtUser = message.members.first();
*/

/*  if(message.guild.id == 341080914434195468) { // DoW
    await message.delete();
    console.log("Lopslap disabled on DoW");
    return;
  }
*/
  if(message.guild.id == 341080914434195468 &&
      message.channel.id != 386962337497743362	// #chat-about-anything
  ) {
    console.log("Lopslap on DoW restricted to #chat-about-anything");
    return;
  }
//    message.reply("Krylar mentioned? " + message.mentions.users.has("344547702157082636"));
//  if(message.mentions.users.has("344547702157082636")) { // Krylar
  if(message.mentions.users.has("162901943478517760")) { // Badger
    console.log("Badger rendered immune to Lopslap. Deleting message...");
//    message.reply("get: " + message.mentions.users.get(344547702157082636));
//    message.reply("Not 0");
    await message.delete();
    return;
  }
  let tgtUser = message.mentions.members.first() || message.guild.members.get(args[0]);
  if(!tgtUser)
    return message.reply("Please mention a valid member of this server");
  if(message.member.id == 414664957171466241) // Lop
    tgtUser = message.member;

  let tgtRole = message.guild.roles.find("name", "Lopslapped");
//  tgtRole.then(updated => message.channel.send(`Role (merging): ${tgtRole}`));
//  tgtRole.catch(console.error);
//  console.log(tgtRole);

//  message.member.addRole(tgtRole);
  message.channel.send(tgtUser + " has been Lopslapped by " + message.author + " for being a ninny!");
//  message.channel.send("author: " + message.author + "\nu: " + tgtUser);
  tgtUser.addRole(tgtRole);
  message.delete()
    .then(msg => console.log(`Deleted message from ${msg.author.username}`))
    .catch(console.error);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "lopslap",
  category: "Merge Administration",
  description: "Lopslap <user> for being a ninny",
  usage: "lopslap <user>"
};
