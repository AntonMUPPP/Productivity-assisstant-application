// JavaScript code for managing calendar events
function calendarWindow() {
  const calendarModal = document.getElementById("calendarModal");
  const overlayCalendar = document.querySelector(".overlayCalendar");

  // Перевірка чи модальне вікно календаря відкрите чи закрите
  const isOpen = calendarModal.style.display === "block";

  // Відкриття або закриття вікна календаря та відображення або приховання overlay
  if (isOpen) {
    calendarModal.style.display = "none";
    overlayCalendar.style.display = "none";
  } else {
    calendarModal.style.display = "block";
    overlayCalendar.style.display = "block";
    displayEvents(); // Відображення подій при відкритті вікна календаря
  }
}

// Функція для додавання нової події в календар
function addEvent() {
  const eventName = document.getElementById("eventName").value;
  const eventStartTime = document.getElementById("eventStartTime").value;
  const eventEndTime = document.getElementById("eventEndTime").value;

  // Виконати дії з отриманими даними (наприклад, збереження в локальному сховищі або відправлення на сервер)
  // Наприклад:
  const newEvent = {
    name: eventName,
    startTime: eventStartTime,
    endTime: eventEndTime,
  };

  // Додати нову подію до списку подій
  let events = JSON.parse(localStorage.getItem("events")) || [];
  events.push(newEvent);
  localStorage.setItem("events", JSON.stringify(events));

  // Після додавання події оновити відображення подій
  displayEvents();
}

// Функція для відображення подій у вікні календаря
// Функція для відображення подій у вікні календаря
function displayEvents() {
  const eventList = document.getElementById("eventListCalendar");
  eventList.innerHTML = ""; // Очищаємо попередні відображені події

  const events = JSON.parse(localStorage.getItem("events")) || [];
  const currentTime = new Date(); // Поточний час

  // Розділити події на поточні та минулі
  const currentEvents = [];
  const pastEvents = [];
  events.forEach((event) => {
    if (new Date(event.endTime) < currentTime) {
      pastEvents.push(event);
    } else {
      currentEvents.push(event);
    }
  });

  // Відображення поточних подій
  const currentEventsHeader = document.createElement("h3");
  currentEventsHeader.textContent = "Current Events";
  eventList.appendChild(currentEventsHeader);
  displayEventList(currentEvents);

  // Відображення минулих подій
  const pastEventsHeader = document.createElement("h3");
  pastEventsHeader.textContent = "Past Events";
  eventList.appendChild(pastEventsHeader);
  displayEventList(pastEvents);
}

// Допоміжна функція для відображення списку подій у вікні календаря
function displayEventList(events) {
  const eventList = document.getElementById("eventListCalendar");
  events.forEach((event) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${event.name} - ${event.startTime} to ${event.endTime}`;
    eventList.appendChild(listItem);
  });
}

// Додамо обробник події для форми додавання події
document
  .getElementById("calendarForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Зупиняємо дефолтну дію форми (відправку)

    // Викликаємо функцію для додавання події
    addEvent();
  });

// // When the DOM content is fully loaded, execute the following function
// document.addEventListener("DOMContentLoaded", function () {
//   // Get references to DOM elements
//   const calendarModal = document.getElementById("calendarModal");
//   const calendarForm = document.getElementById("calendarForm");
//   const pastEventList = document.getElementById("pastEventList");
//   // Перевірте, чи існує елемент upcomingEventList
//   const upcomingEventList = document.getElementById("upcomingEventList");
//   if (upcomingEventList) {
//     // Додайте слухач подій, якщо елемент існує
//     upcomingEventList.addEventListener("click", function (event) {
//       if (event.target.classList.contains("delete-event")) {
//         const index = parseInt(event.target.getAttribute("data-index"));
//         deleteEvent(index);
//       }
//     });
//   }

//   // Function to save events to local storage
//   function saveEventsToLocalStorage(events) {
//     localStorage.setItem("events", JSON.stringify(events));
//   }

//   // Function to retrieve events from local storage
//   function getEventsFromLocalStorage() {
//     const events = localStorage.getItem("events");
//     return events ? JSON.parse(events) : [];
//   }

//   // Function to show the calendar modal
//   function showCalendar() {
//     calendarModal.style.display = "block";
//   }

//   // Event listener for showing the calendar modal when the calendar button is clicked
//   const calendarBtn = document.querySelector(".calendar-btn");
//   calendarBtn.addEventListener("click", showCalendar);

//   // Event listener for hiding the calendar modal when the close button is clicked
//   const calendarCloseBtn = document.querySelector(".close-calendar");
//   calendarCloseBtn.addEventListener("click", function () {
//     calendarModal.style.display = "none";
//   });

//   // Function to add a new event
//   function addEvent(event) {
//     // Prevent default form submission behavior
//     event.preventDefault();
//     // Get the event name, start time, and end time from the form inputs
//     const eventName = document.getElementById("eventName").value;
//     const eventStartTime = new Date(
//       document.getElementById("eventStartTime").value
//     );
//     const eventEndTime = new Date(
//       document.getElementById("eventEndTime").value
//     );

//     // Retrieve events from local storage
//     const myEvents = getEventsFromLocalStorage();

//     // Check for event conflicts
//     const hasConflict = myEvents.some((existingEvent) => {
//       // Convert existing event start and end times to Date objects
//       const existingEventStartTime = new Date(existingEvent.startTime);
//       const existingEventEndTime = new Date(existingEvent.endTime);
//       // Check for three possible conflict scenarios:
//       return (
//         // 1. New event starts during an existing event
//         (eventStartTime >= existingEventStartTime &&
//           eventStartTime < existingEventEndTime) ||
//         // 2. New event ends during an existing event
//         (eventEndTime > existingEventStartTime &&
//           eventEndTime <= existingEventEndTime) ||
//         // 3. New event completely overlaps an existing event
//         (eventStartTime <= existingEventStartTime &&
//           eventEndTime >= existingEventEndTime)
//       );
//     });

//     // If there's a conflict, show an alert and return
//     if (hasConflict) {
//       alert("You have already an event at this time");
//       return;
//     }

//     // Otherwise, add the new event, save it to local storage, and display the updated list of events
//     const updatedEvents = [
//       ...myEvents,
//       {
//         name: eventName,
//         startTime: eventStartTime.toISOString(),
//         endTime: eventEndTime.toISOString(),
//       },
//     ];

//     saveEventsToLocalStorage(updatedEvents);
//     displayEvents(updatedEvents);
//     event.target.reset();
//   }

//   // Event listener for adding an event when the calendar form is submitted
//   calendarForm.addEventListener("submit", addEvent);

//   // Function to delete an event
//   function deleteEvent(index) {
//     const myEvents = getEventsFromLocalStorage();
//     // Remove the event at the specified index from the events array
//     myEvents.splice(index, 1);
//     // Save the updated events to local storage
//     saveEventsToLocalStorage(myEvents);
//     // Display the updated list of events
//     displayEvents(getEventsFromLocalStorage());
//   }

//   // Event listener for deleting an event from the upcoming event list
//   upcomingEventList.addEventListener("click", function (event) {
//     // Check if the clicked element has the class "delete-event"
//     if (event.target.classList.contains("delete-event")) {
//       // Get the index of the event to be deleted from the data-index attribute
//       const index = parseInt(event.target.getAttribute("data-index"));
//       // Call the deleteEvent function with the index of the event to be deleted
//       deleteEvent(index);
//     }
//   });

//   // Event listener for deleting an event from the past event list
//   pastEventList.addEventListener("click", function (event) {
//     if (event.target.classList.contains("delete-event")) {
//       // Get the index of the event to be deleted from the data-index attribute
//       const index = parseInt(event.target.getAttribute("data-index"));
//       deleteEvent(index);
//     }
//   });

//   // Display the events from local storage when the page loads
//   displayEvents(getEventsFromLocalStorage());

//   // Function to display the list of events
//   function displayEvents(events) {
//     // Clear the contents of the upcoming event list and past event list
//     upcomingEventList.innerHTML = "";
//     pastEventList.innerHTML = "";
//     // Get the current time
//     const currentTime = new Date();
//     // Filter events into upcoming events (events with end time after current time)
//     const upcomingEvents = events.filter(
//       (event) => new Date(event.endTime) > currentTime
//     );
//     // Filter events into past events (events with end time on or before current time)
//     const pastEvents = events.filter(
//       (event) => new Date(event.endTime) <= currentTime
//     );

//     // Function to format date and time
//     function formatDateTime(dateTime) {
//       return dateTime.toLocaleString("en-US", {
//         day: "2-digit",
//         month: "2-digit",
//         year: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       });
//     }

//     // Function to create an event item
//     function createEventItem(event, index) {
//       // Create a list item element for the event
//       const eventItem = document.createElement("li");

//       // Convert event start and end times to Date objects
//       const startTime = new Date(event.startTime);
//       const endTime = new Date(event.endTime);

//       // Format start and end times
//       const formattedStartTime = formatDateTime(startTime);
//       const formattedEndTime = formatDateTime(endTime);

//       // Create elements for event name, start time, and end time
//       const eventName = document.createElement("span");
//       eventName.textContent = event.name;
//       eventName.classList.add("event-name");

//       const startLabel = document.createElement("span");
//       startLabel.textContent = "Start Time: ";
//       startLabel.classList.add("event-time");

//       const endLabel = document.createElement("span");
//       endLabel.textContent = "End Time: ";
//       endLabel.classList.add("event-time");

//       // Create text nodes for formatted start and end times
//       const startTimeText = document.createTextNode(formattedStartTime);
//       const endTimeText = document.createTextNode(formattedEndTime);

//       // Append event name to the event item and add a line break
//       eventItem.appendChild(eventName); // Append event name
//       eventItem.appendChild(document.createElement("br")); // Line break

//       // Append start time label, start time text, and a line break
//       eventItem.appendChild(startLabel);
//       eventItem.appendChild(startTimeText);
//       eventItem.appendChild(document.createElement("br")); // Line break

//       // Append end time label, end time text, and a line break
//       eventItem.appendChild(endLabel);
//       eventItem.appendChild(endTimeText);

//       // Create a delete button, set its text content and attributes
//       const deleteButton = document.createElement("button");
//       deleteButton.textContent = "Delete";
//       deleteButton.classList.add("delete-event");
//       deleteButton.setAttribute("data-index", index); // Set data-index attribute

//       // Append delete button to the event item
//       eventItem.appendChild(deleteButton);

//       // Return the completed event item
//       return eventItem;
//     }

//     // Function to display a list of events in a specified list container
//     function displayEventList(list, title, events) {
//       // Check if there are events to display
//       if (events.length > 0) {
//         // Create a title element for the list
//         const eventsTitle = document.createElement("h2");
//         eventsTitle.textContent = title; // Set the title text content
//         list.appendChild(eventsTitle); // Append the title to the list container

//         // Iterate through each event in the events array
//         events.forEach((event) => {
//           // Create an event item using the createEventItem function
//           const eventItem = createEventItem(event);
//           // Append the event item to the list container
//           list.appendChild(eventItem);
//         });
//       }
//     }

//     // Display upcoming and past events
//     displayEventList(upcomingEventList, "Upcoming Events", upcomingEvents);
//     displayEventList(pastEventList, "Past Events", pastEvents);
//   }
// });
