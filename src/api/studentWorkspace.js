import api from "./client";

export const studentWorkspace = {
    byStudentId: (studentId) =>
        api.get(`/student-workspace/${studentId}`).then((response) => response.data),
};