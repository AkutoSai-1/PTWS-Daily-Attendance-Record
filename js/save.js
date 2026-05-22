function getNextExpiryTimestamp() {
  const now = new Date();
  const expiry = new Date();

  expiry.setHours(14, 45, 0, 0); 

  if (now >= expiry) {
    expiry.setDate(expiry.getDate() + 1);
  }

  return expiry.getTime();
}

function saveAttendanceTable() {
  const rows = document.querySelectorAll("tbody tr");
  const tableData = [];

  rows.forEach((row) => {
    tableData.push({
      firstName: row.querySelector(".first-name")?.innerText.trim() || "",
      surname: row.querySelector(".surname")?.innerText.trim() || "",
      studentClass: row.querySelector(".student-class")?.value || "",
      studentGender: row.querySelector(".student-gender")?.value || "",
      date: row.querySelector(".date-cell")?.innerText.trim() || "",
      isPresent: row.querySelector(".checkbox")?.checked || false,
    });
  });

  const storagePayload = {
    expiry: getNextExpiryTimestamp(),
    data: tableData,
  };

  localStorage.setItem("ptws_attendance_data", JSON.stringify(storagePayload));
}

function loadAttendanceTable() {
  const storedDataStr = localStorage.getItem("ptws_attendance_data");
  if (!storedDataStr) return;

  try {
    const payload = JSON.parse(storedDataStr);
    const now = new Date().getTime();

    if (now >= payload.expiry) {
      localStorage.removeItem("ptws_attendance_data");
      return;
    }

    const tbody = document.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    payload.data.forEach((student) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td contenteditable="true" class="first-name">${student.firstName}</td>
        <td contenteditable="true" class="surname">${student.surname}</td>
        <td>
          <select class="student-class" name="student_class">
            <option value="">Select Class</option>
            <option value="Form 1" ${student.studentClass === "Form 1" ? "selected" : ""}>Form 1</option>
            <option value="Form 2" ${student.studentClass === "Form 2" ? "selected" : ""}>Form 2</option>
            <option value="Form 3" ${student.studentClass === "Form 3" ? "selected" : ""}>Form 3</option>
            <option value="Form 4" ${student.studentClass === "Form 4" ? "selected" : ""}>Form 4</option>
            <option value="Form 5" ${student.studentClass === "Form 5" ? "selected" : ""}>Form 5</option>
            <option value="Lower 6" ${student.studentClass === "Lower 6" ? "selected" : ""}>Lower 6</option>
            <option value="Upper 6" ${student.studentClass === "Upper 6" ? "selected" : ""}>Upper 6</option>
          </select>
        </td>
        <td>
          <select class="student-gender" name="student_gender">
            <option value="">Select Gender</option>
            <option value="Male" ${student.studentGender === "Male" ? "selected" : ""}>Male</option>
            <option value="Female" ${student.studentGender === "Female" ? "selected" : ""}>Female</option>
          </select>
        </td>
        <td class="date-cell">${student.date}</td>
        <td><input type="checkbox" class="checkbox" ${student.isPresent ? "checked" : ""} /></td>
        <td>
          <button class="trash">
            <i class="fa fa-trash-o"></i>
          </button>
        </td>
      `;
      tbody.appendChild(row);

      bindRowListeners(row);
    });
  } catch (error) {
    console.error("Error restoring session state:", error);
  }
}

function bindRowListeners(row) {
  row
    .querySelector(".student-class")
    ?.addEventListener("change", saveAttendanceTable);
  row
    .querySelector(".student-gender")
    ?.addEventListener("change", saveAttendanceTable);
  row
    .querySelector(".checkbox")
    ?.addEventListener("change", saveAttendanceTable);
  row
    .querySelector(".first-name")
    ?.addEventListener("input", saveAttendanceTable);
  row.querySelector(".surname")?.addEventListener("input", saveAttendanceTable);
}

document.addEventListener("DOMContentLoaded", () => {
  loadAttendanceTable();

  setInterval(() => {
    const storedDataStr = localStorage.getItem("ptws_attendance_data");
    if (storedDataStr) {
      const payload = JSON.parse(storedDataStr);
      if (new Date().getTime() >= payload.expiry) {
        localStorage.removeItem("ptws_attendance_data");
        const tbody = document.querySelector("tbody");
        if (tbody) tbody.innerHTML = "";
      }
    }
  }, 30000);
});
