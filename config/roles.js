const roles = ["student", "tutor", "admin"];

const roleRights = new Map();

const getPermissionList = [
  "getUser",
  "getUsers",
  "getSubject",
  "getSubjects",
  "getQuestion",
  "getQuestions",
  "getResult",
  "getExams",
  "getResult"
];
const studentPermissionList = [];
const tutorManagePermissionList = [
  "manageSubjects",
  "manageQuestions",
  "manageExam",
  "manageResult",
];
const adminManagePermissionList = ["manageUsers"];

roleRights.set(roles[0], studentPermissionList.concat(getPermissionList));

roleRights.set(
  roles[1],
  tutorManagePermissionList.concat(getPermissionList, studentPermissionList)
);

roleRights.set(
  roles[2],
  adminManagePermissionList.concat(
    getPermissionList,
    studentPermissionList,
    tutorManagePermissionList
  )
);

module.exports = {
  roles,
  roleRights,
};
