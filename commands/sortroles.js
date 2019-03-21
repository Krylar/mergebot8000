exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
//  message.reply(`Your permission level is: ${level} - ${friendly}`);

  // ********** SETUP **********
  // get server
  let g = message.guild;

  // get merging role
  let mergingRole = g.roles.find("name", "MergeBot8000");
  message.channel.send(`MergeBot8000 role found at position ${mergingRole.position}`);

//  let serverRoles = message.guild.roles;
  let serverRoles = message.guild.roles.filter(r => r.name.search(/^[0-9]/) == 0);
  let targetPosition = mergingRole.calculatedPosition - 1;
//  targetPosition = 10;

  let msg = '';

  // sort roles
/*  serverRoles.sort((r1, r2) => r1.position !== r2.position ? r2.position - r1.position: r1.id - r2.id)
    .forEach(r => {
      msg += `\n${r.position} - ${r.name}`;
    });
*/

  serverRoles.sort((a, b) => b.name - a.name)
    .forEach(r => {
//      if(r.name > 0) {
      msg += `\n${r.position} - ${r.name}`;
      message.channel.send(`Repositioning ${r.name} at ${r.position} to position ${targetPosition}`);
      // set role position
      r.setPosition(targetPosition)
        .then(updated => console.log(`Role position for ${updated.name}: ${updated.position}`))
        .catch(console.error);
      targetPosition--;
//      }
    });

  message.channel.send(msg);
  message.channel.send(`Sort complete!`, {code:"asciidoc"});
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["sr"],
  permLevel: "Moderator"
};

exports.help = {
  name: "sortroles",
  category: "Merge Administration",
  description: "Sorts server roles in reverse order, immediately following the \"merging\" role.",
  usage: "sortroles"
};
