// ====== НАСТРОЙКИ ======
const WEDDING_DATE = new Date("2026-08-09T16:00:00"); // <-- поменяй дату/время
const CALENDAR = {
    year: 2026,            // <-- год
    monthIndex: 7,         // <-- 0=янв ... 7=август
    heartDay: 9            // <-- день с сердцем
};

// ====== INTRO / OPEN ENVELOPE ======
const intro = document.getElementById("intro");
const page = document.getElementById("page");
const openBtn = document.getElementById("openBtn");
const scrollHint = document.getElementById("scrollHint");

let opened = false;

// блокируем скролл, пока не открыли
document.documentElement.style.scrollBehavior = "smooth";
document.body.style.overflow = "hidden";

openBtn.addEventListener("click", () => {
    if (opened) return;
    opened = true;

    intro.classList.add("is-open");
    scrollHint?.setAttribute("aria-hidden", "false");

    // показываем основной контент, но оставляем интро поверх на время
    page.classList.add("is-visible");
    page.setAttribute("aria-hidden", "false");

    // через чуть-чуть разрешим скролл
    setTimeout(() => {
        document.body.style.overflow = "auto";

        // красиво “уезжаем” на первый блок (можешь отключить)
        document.getElementById("page").scrollIntoView({ behavior: "smooth" });

        // скрываем интро спустя еще немного (чтобы успело открыться)
        setTimeout(() => {
            intro.classList.add("is-hidden");
            intro.setAttribute("aria-hidden", "true");
        }, 700);
    }, 1100);
});

// ====== КАЛЕНДАРЬ (как на видео) ======
function buildCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;

    const { year, monthIndex, heartDay } = CALENDAR;
    const first = new Date(year, monthIndex, 1);
    const last = new Date(year, monthIndex + 1, 0);
    const daysInMonth = last.getDate();

    // ПН..ВС, а JS дает 0..6 (ВС..СБ)
    const jsDay = first.getDay();              // 0=вс
    const mondayFirstOffset = (jsDay + 6) % 7; // 0=пн

    // пустые ячейки до 1-го числа
    for (let i = 0; i < mondayFirstOffset; i++) {
        const d = document.createElement("div");
        d.className = "day is-empty";
        d.textContent = "";
        grid.appendChild(d);
    }

    // дни
    for (let day = 1; day <= daysInMonth; day++) {
        const d = document.createElement("div");
        d.className = "day";
        if (day === heartDay) d.classList.add("is-heart");
        d.innerHTML = day === heartDay ? `<b>${day}</b>` : `${day}`;
        grid.appendChild(d);
    }
}
buildCalendar();

// ====== ТАЙМЕР ======
const tDays = document.getElementById("tDays");
const tHours = document.getElementById("tHours");
const tMins = document.getElementById("tMins");
const tSecs = document.getElementById("tSecs");

function pad(n) { return String(n).padStart(2, "0"); }

function tick() {
    const now = new Date();
    let diff = Math.max(0, WEDDING_DATE - now);

    const sec = Math.floor(diff / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;

    if (tDays) tDays.textContent = days;
    if (tHours) tHours.textContent = pad(hours);
    if (tMins) tMins.textContent = pad(mins);
    if (tSecs) tSecs.textContent = pad(secs);
}
tick();
setInterval(tick, 1000);

// ====== RSVP (демо-отправка) ======
const form = document.getElementById("rsvpForm");

form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    // ДЕМО: просто покажем
    alert(
        "Спасибо! Мы получили вашу анкету 💛\n\n" +
        `Присутствие: ${data.attendance}\n` +
        `Имя: ${data.fullname}\n` +
        `С парой: ${data.plusone || "—"}\n` +
        `Комментарий: ${data.comment || "—"}`
    );

    form.reset();

    // ====== КУДА ПОДКЛЮЧИТЬ НАСТОЯЩУЮ ОТПРАВКУ ======
    // ВАЖНО: токен бота нельзя хранить на фронте!
    // Сделай серверный endpoint (например, Cloudflare Worker / Netlify Function)
    // и отправляй данные туда:
    //
    // await fetch("/api/rsvp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data)
    // });
});