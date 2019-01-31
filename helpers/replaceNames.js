module.exports = replaceNames = (agentData, studentQueue, adminQueue) => {
  // replaces names from admin/ student q with less crap ones
  for (el in agentData) {
    let peerName = agentData[el].peerName;
    let toChange = "";
    if (agentData[el].userId.includes(".instru")) {
      toChange = agentData[el].userId.replace(".instru", "");
    } else if (agentData[el].userId.includes("@instructure")) {
      toChange = agentData[el].userId.replace("@instructure.com", "");
    } else {
      toChange = agentData[el].userId;
    }

    adminQueue.forEach(admin => {
      let agentName = admin.name;
      if (peerName === agentName) {
        return (admin.userId = toChange);
      }
    });

    studentQueue.forEach(student => {
      let agentName = student.name;
      if (peerName === agentName) {
        return (student.userId = toChange);
      }
    });
  }
};
