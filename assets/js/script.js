/*
WARNING: the code that follows will make you cry; a safety pig is provided below for your benefit.

                         _
 _._ _..._ .-',     _.._(`))
'-. `     '  /-._.-'    ',/
   )         \            '.
  / _    _    |             \
 |  a    a    /              |
 \   .-.                     ;  
  '-('' ).-'       ,'       ;
     '-;           |      .'
        \           \    /
        | 7  .__  _.-\   \
        | |  |  ``/  /`  /
       /,_|  |   /,_/   /
          /,_/      '`-'
*/

const WEEKDAY_MAPPINGS = new Map([
    ["Mo", "monday"],
    ["Di", "tuesday"],
    ["Mi", "wednesday"],
    ["Do", "thursday"],
    ["Fr", "friday"]
]);

const SEMESTER_SELECT = document.getElementById("semester-select");
SEMESTER_SELECT.addEventListener("change", () => reloadSemester());

const COURSE_SELECT = document.getElementById("course-select");
COURSE_SELECT.addEventListener("change", () => reloadCourse());

let DATA;

(async function main() {
    let response = await fetch("https://corsproxy.io/?" + encodeURIComponent("https://mpl-server.kr.hs-niederrhein.de/fb03/data/data.json?t=" + Date.now()));
    DATA = await response.json();

    loadSemesterSelectOptions();
})();

async function loadSemesterSelectOptions() {
    for (let child of SEMESTER_SELECT.children) {
        child.innerText += " " + DATA["jahr_" + child.value];
    }

    reloadSemester();
}

async function reloadSemester() {
    let semester = SEMESTER_SELECT.value;

    COURSE_SELECT.replaceChildren([]);
    DATA[semester].studiengaenge.forEach(course => {
        COURSE_SELECT.appendChild(new Option(course.studiengang, course.kuerzel));
    });

    reloadCourse();
}

async function reloadCourse() {
    let semester = SEMESTER_SELECT.value;
    let course = COURSE_SELECT.value;

    for (let value of WEEKDAY_MAPPINGS.values()) {
        for (let i = 1; i < 14; i++) {
            document.getElementById(value + "-" + String(i)).getElementsByClassName("content")[0].innerText = "";
        }
    }

    DATA[semester].veranstaltungen.filter(event => event.Semester === course).forEach(event => {
        let id = WEEKDAY_MAPPINGS.get(event.Wochentag) + "-" + String(Number(event.Beginn) - 7);
        let content = document.getElementById(id).getElementsByClassName("content")[0];

        let subject = document.createElement("div");
        subject.innerText = event.Fach_Kurz + " (" + event.Art + ")";
        content.appendChild(subject);

        let professor = document.createElement("div");
        professor.innerText = event.Professor;
        content.appendChild(professor);

        let room = document.createElement("div");
        room.innerText = event.Raum;
        content.appendChild(room);
    });
}
