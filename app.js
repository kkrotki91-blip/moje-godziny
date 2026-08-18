const monthTitle = document.getElementById("monthTitle");
const calendar = document.getElementById("calendar");

const totalHoursElement =
    document.getElementById("totalHours");

const hourlyRateElement =
    document.getElementById("hourlyRate");

const totalEarningsElement =
    document.getElementById("totalEarnings");

const rateButton =
    document.getElementById("rateButton");

const prevMonthButton =
    document.getElementById("prevMonth");

const nextMonthButton =
    document.getElementById("nextMonth");


// =====================================
// URLOP
// =====================================

const vacationUsedElement =
    document.getElementById("vacationUsed");

const vacationRemainingElement =
    document.getElementById("vacationRemaining");

const vacationLimitButton =
    document.getElementById("vacationLimitButton");


// =====================================
// OKNO EDYCJI DNIA
// =====================================

const dayModal =
    document.getElementById("dayModal");

const modalDate =
    document.getElementById("modalDate");

const hoursInput =
    document.getElementById("hoursInput");

const closeModalButton =
    document.getElementById("closeModal");

const cancelModalButton =
    document.getElementById("cancelModal");

const saveEntryButton =
    document.getElementById("saveEntry");

const deleteEntryButton =
    document.getElementById("deleteEntry");

const dayTypeButtons =
    document.querySelectorAll(".day-type");


// =====================================
// NAZWY MIESIĘCY
// =====================================

const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień"
];


// =====================================
// DANE
// =====================================

let currentDate = new Date();

let workData = JSON.parse(
    localStorage.getItem("workData") || "{}"
);

let hourlyRate = parseFloat(
    localStorage.getItem("hourlyRate") || "0"
);


// =====================================
// LIMIT URLOPU
// =====================================
//
// Domyślnie 26 dni.
// Użytkownik może zmienić tę wartość.
//

let vacationLimit = parseInt(
    localStorage.getItem("vacationLimit") || "26",
    10
);


// =====================================
// AKTUALNIE WYBRANY DZIEŃ
// =====================================

let selectedDateKey = null;

let selectedType = "work";


// =====================================
// ZAPIS DANYCH
// =====================================

function saveData() {

    localStorage.setItem(
        "workData",
        JSON.stringify(workData)
    );

    localStorage.setItem(
        "hourlyRate",
        hourlyRate
    );

    localStorage.setItem(
        "vacationLimit",
        vacationLimit
    );
}


// =====================================
// FORMATOWANIE LICZB
// =====================================

function formatNumber(number) {

    return number.toLocaleString("pl-PL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}


// =====================================
// KLUCZ DATY
// =====================================

function getDateKey(year, month, day) {

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}


// =====================================
// WYŚWIETLANIE KALENDARZA
// =====================================

function renderCalendar() {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    monthTitle.textContent =
        `${monthNames[month]} ${year}`;


    calendar.innerHTML = "";


    const firstDay =
        new Date(year, month, 1);


    let startingDay =
        firstDay.getDay();


    // Poniedziałek jako pierwszy dzień tygodnia
    startingDay =
        startingDay === 0
            ? 6
            : startingDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // =================================
    // PUSTE POLA PRZED PIERWSZYM DNIEM
    // =================================

    for (
        let i = 0;
        i < startingDay;
        i++
    ) {

        const emptyDay =
            document.createElement("div");

        emptyDay.className =
            "day";

        emptyDay.style.visibility =
            "hidden";

        calendar.appendChild(
            emptyDay
        );
    }


    // =================================
    // DNI MIESIĄCA
    // =================================

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateKey =
            getDateKey(
                year,
                month,
                day
            );


        const dayElement =
            document.createElement("div");

        dayElement.className =
            "day";


        // =================================
        // NUMER DNIA
        // =================================

        const numberElement =
            document.createElement("div");

        numberElement.className =
            "day-number";

        numberElement.textContent =
            day;

        dayElement.appendChild(
            numberElement
        );


        // =================================
        // DZISIAJ
        // =================================

        const today =
            new Date();

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add(
                "today"
            );
        }


        // =================================
        // ODCZYT WPISU
        // =================================

        const entry =
            workData[dateKey];


        if (entry) {

            const hoursElement =
                document.createElement("span");

            hoursElement.className =
                "hours";


            // =================================
            // ZWYKŁA PRACA
            // =================================

            if (
                entry.type === "work"
            ) {

                // Tylko liczba — bez "h"
                hoursElement.textContent =
                    formatNumber(entry.hours);

                dayElement.classList.add(
                    "work-day"
                );
            }


            // =================================
            // URLOP
            // =================================

            else if (
                entry.type === "vacation"
            ) {

                hoursElement.textContent =
                    "URL";

                dayElement.classList.add(
                    "vacation-day"
                );
            }


            // =================================
            // ODDAWANIE KRWI
            // =================================

            else if (
                entry.type === "blood"
            ) {

                hoursElement.textContent =
                    "KREW";

                dayElement.classList.add(
                    "blood-day"
                );
            }


            // =================================
            // WOLNE
            // =================================

            else if (
                entry.type === "free"
            ) {

                hoursElement.textContent =
                    "WOLNE";

                dayElement.classList.add(
                    "free-day"
                );
            }


            dayElement.appendChild(
                hoursElement
            );
        }


        // =================================
        // KLIKNIĘCIE DNIA
        // =================================

        dayElement.addEventListener(
            "click",
            () => {

                openDayModal(
                    dateKey,
                    day,
                    month,
                    year
                );
            }
        );


        calendar.appendChild(
            dayElement
        );
    }


    updateSummary();
}


// =====================================
// OTWARCIE OKNA DNIA
// =====================================

function openDayModal(
    dateKey,
    day,
    month,
    year
) {

    selectedDateKey =
        dateKey;


    const entry =
        workData[dateKey];


    modalDate.textContent =
        `${day} ${monthNames[month]} ${year}`;


    // =================================
    // USTALENIE TYPU
    // =================================

    if (entry) {

        selectedType =
            entry.type;

        hoursInput.value =
            entry.hours;

    } else {

        selectedType =
            "work";

        hoursInput.value =
            "";
    }


    // =================================
    // BLOKADA POLA GODZIN
    // =================================

    if (
        selectedType === "work"
    ) {

        hoursInput.readOnly =
            false;

        hoursInput.style.opacity =
            "1";

    } else {

        hoursInput.readOnly =
            true;

        hoursInput.style.opacity =
            "0.6";
    }


    updateTypeButtons();


    // Pokazanie okna
    dayModal.classList.remove(
        "hidden"
    );


    // Automatyczny fokus dla pracy
    setTimeout(() => {

        if (
            selectedType === "work"
        ) {

            hoursInput.focus();
        }

    }, 100);
}


// =====================================
// ZAMKNIĘCIE OKNA
// =====================================

function closeDayModal() {

    dayModal.classList.add(
        "hidden"
    );

    selectedDateKey =
        null;
}


// =====================================
// WYBÓR URLOPU / KRWI / WOLNEGO
// =====================================

dayTypeButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                selectedType =
                    button.dataset.type;


                updateTypeButtons();


                // =================================
                // URLOP
                // =================================

                if (
                    selectedType === "vacation"
                ) {

                    hoursInput.value =
                        "8";

                    hoursInput.readOnly =
                        true;

                    hoursInput.style.opacity =
                        "0.6";
                }


                // =================================
                // ODDAWANIE KRWI
                // =================================

                else if (
                    selectedType === "blood"
                ) {

                    hoursInput.value =
                        "8";

                    hoursInput.readOnly =
                        true;

                    hoursInput.style.opacity =
                        "0.6";
                }


                // =================================
                // WOLNE
                // =================================

                else if (
                    selectedType === "free"
                ) {

                    hoursInput.value =
                        "0";

                    hoursInput.readOnly =
                        true;

                    hoursInput.style.opacity =
                        "0.6";
                }


                // =================================
                // ZWYKŁA PRACA
                // =================================

                else {

                    selectedType =
                        "work";

                    hoursInput.readOnly =
                        false;

                    hoursInput.style.opacity =
                        "1";

                    hoursInput.value =
                        "";

                    hoursInput.focus();

                    updateTypeButtons();
                }
            }
        );
    }
);


// =====================================
// KLIKNIĘCIE POLA GODZIN
// =====================================
//
// Jeśli przez pomyłkę wybraliśmy
// Urlop / Krew / Wolne,
// kliknięcie pola wraca do pracy.
//

hoursInput.addEventListener(
    "click",
    () => {

        selectedType =
            "work";

        hoursInput.readOnly =
            false;

        hoursInput.style.opacity =
            "1";

        updateTypeButtons();

        hoursInput.focus();
    }
);


// =====================================
// WPISYWANIE GODZIN
// =====================================

hoursInput.addEventListener(
    "input",
    () => {

        if (
            selectedType !== "work"
        ) {

            selectedType =
                "work";

            hoursInput.readOnly =
                false;

            hoursInput.style.opacity =
                "1";

            updateTypeButtons();
        }
    }
);


// =====================================
// PODŚWIETLENIE WYBRANEGO TYPU
// =====================================

function updateTypeButtons() {

    dayTypeButtons.forEach(
        button => {

            button.classList.toggle(
                "selected",
                button.dataset.type ===
                    selectedType
            );
        }
    );
}


// =====================================
// ZAPIS DNIA
// =====================================

saveEntryButton.addEventListener(
    "click",
    () => {

        if (
            !selectedDateKey
        ) {

            return;
        }


        // =================================
        // URLOP
        // =================================

        if (
            selectedType === "vacation"
        ) {

            workData[
                selectedDateKey
            ] = {

                type: "vacation",

                hours: 8
            };
        }


        // =================================
        // KREW
        // =================================

        else if (
            selectedType === "blood"
        ) {

            workData[
                selectedDateKey
            ] = {

                type: "blood",

                hours: 8
            };
        }


        // =================================
        // WOLNE
        // =================================

        else if (
            selectedType === "free"
        ) {

            workData[
                selectedDateKey
            ] = {

                type: "free",

                hours: 0
            };
        }


        // =================================
        // ZWYKŁA PRACA
        // =================================

        else {

            const hours =
                parseFloat(
                    hoursInput.value
                        .replace(",", ".")
                );


            if (
                isNaN(hours) ||
                hours < 0
            ) {

                alert(
                    "Wpisz poprawną liczbę godzin."
                );

                return;
            }


            // 0 godzin = usunięcie wpisu
            if (
                hours === 0
            ) {

                delete workData[
                    selectedDateKey
                ];

            } else {

                workData[
                    selectedDateKey
                ] = {

                    type: "work",

                    hours: hours
                };
            }
        }


        saveData();

        closeDayModal();

        renderCalendar();
    }
);


// =====================================
// USUNIĘCIE WPISU
// =====================================

deleteEntryButton.addEventListener(
    "click",
    () => {

        if (
            !selectedDateKey
        ) {

            return;
        }


        delete workData[
            selectedDateKey
        ];


        saveData();

        closeDayModal();

        renderCalendar();
    }
);


// =====================================
// ANULOWANIE
// =====================================

closeModalButton.addEventListener(
    "click",
    closeDayModal
);

cancelModalButton.addEventListener(
    "click",
    closeDayModal
);


// =====================================
// KLIKNIĘCIE POZA OKNEM
// =====================================

dayModal.addEventListener(
    "click",
    event => {

        if (
            event.target === dayModal
        ) {

            closeDayModal();
        }
    }
);


// =====================================
// LICZENIE URLOPU W CAŁYM ROKU
// =====================================

function getVacationUsedForYear(year) {

    let vacationUsed = 0;

    const yearPrefix = `${year}-`;

    Object.keys(workData).forEach(dateKey => {

        // Sprawdzamy, czy wpis należy do wybranego roku
        if (!dateKey.startsWith(yearPrefix)) {
            return;
        }

        const entry = workData[dateKey];

        // Każdy dzień oznaczony jako Urlop = 1 dzień urlopu
        if (
            entry &&
            entry.type === "vacation"
        ) {
            vacationUsed++;
        }
    });

    return vacationUsed;
}


// =====================================
// AKTUALIZACJA LICZNIKA URLOPU
// =====================================

function updateVacationSummary() {

    const year =
        currentDate.getFullYear();


    const vacationUsed =
        getVacationUsedForYear(year);


    const vacationRemaining =
        Math.max(
            vacationLimit -
            vacationUsed,
            0
        );


    vacationUsedElement.textContent =
        `${vacationUsed} / ${vacationLimit} dni`;


    vacationRemainingElement.textContent =
        `${vacationRemaining} dni`;
}


// =====================================
// PODSUMOWANIE MIESIĄCA
// =====================================

function updateSummary() {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    let totalHours = 0;


    Object.keys(workData).forEach(
        dateKey => {

            const [
                y,
                m
            ] =
                dateKey
                    .split("-")
                    .map(Number);


            if (
                y === year &&
                m === month + 1
            ) {

                const entry =
                    workData[dateKey];


                if (entry) {

                    totalHours +=
                        Number(
                            entry.hours || 0
                        );
                }
            }
        }
    );


    const earnings =
        totalHours *
        hourlyRate;


    totalHoursElement.textContent =
        `${formatNumber(totalHours)} h`;


    hourlyRateElement.textContent =
        `${formatNumber(hourlyRate)} zł/h`;


    totalEarningsElement.textContent =
        `${formatNumber(earnings)} zł`;


    // Licznik urlopu działa niezależnie
    // od aktualnie wyświetlanego miesiąca
    updateVacationSummary();
}


// =====================================
// USTAWIANIE STAWKI GODZINOWEJ
// =====================================

rateButton.addEventListener(
    "click",
    () => {

        const input =
            prompt(
                "Podaj swoją stawkę godzinową:",
                hourlyRate || ""
            );


        if (
            input === null
        ) {

            return;
        }


        const value =
            parseFloat(
                input.replace(",", ".")
            );


        if (
            isNaN(value) ||
            value < 0
        ) {

            alert(
                "Wpisz poprawną stawkę."
            );

            return;
        }


        hourlyRate =
            value;


        saveData();

        updateSummary();
    }
);


// =====================================
// USTAWIANIE LIMITU URLOPU
// =====================================

vacationLimitButton.addEventListener(
    "click",
    () => {

        const input =
            prompt(
                "Ile dni urlopu masz w roku?",
                vacationLimit
            );


        if (
            input === null
        ) {

            return;
        }


        const value =
            parseInt(
                input,
                10
            );


        if (
            isNaN(value) ||
            value < 0
        ) {

            alert(
                "Wpisz poprawną liczbę dni."
            );

            return;
        }


        vacationLimit =
            value;


        saveData();

        updateVacationSummary();
    }
);


// =====================================
// POPRZEDNI MIESIĄC
// =====================================

prevMonthButton.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();
    }
);


// =====================================
// NASTĘPNY MIESIĄC
// =====================================

nextMonthButton.addEventListener(
    "click",
    () => {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();
    }
);


// =====================================
// URUCHOMIENIE APLIKACJI
// =====================================

renderCalendar();
