// JavaScript code for managing calendar events
function calendarWindow() {
  const calendarModal = document.getElementById("calendarModal");
  const overlayCalendar = document.querySelector(".overlayCalendar");

  // Check if the calendar modal window is open or closed
  const isOpen = calendarModal.style.display === "block";

  // Open or close the calendar window and display or hide overlay accordingly
  if (isOpen) {
    calendarModal.style.display = "none";
    overlayCalendar.style.display = "none";
  } else {
    calendarModal.style.display = "block";
    overlayCalendar.style.display = "block";
    displayEvents(); // Display events when the calendar window is opened
  }
}

// Function to add a new event to the calendar
function addEvent() {
  const eventName = document.getElementById("eventName").value;
  const eventStartTime = new Date(
    document.getElementById("eventStartTime").value
  );
  const eventEndTime = new Date(document.getElementById("eventEndTime").value);

  // Retrieve existing events from local storage
  const existingEvents = JSON.parse(localStorage.getItem("events")) || [];

  // Check for event conflicts
  const hasConflict = existingEvents.some((existingEvent) => {
    const existingEventStartTime = new Date(existingEvent.startTime);
    const existingEventEndTime = new Date(existingEvent.endTime);

    // Check for three possible conflict scenarios:
    return (
      // 1. New event starts during an existing event
      (eventStartTime >= existingEventStartTime &&
        eventStartTime < existingEventEndTime) ||
      // 2. New event ends during an existing event
      (eventEndTime > existingEventStartTime &&
        eventEndTime <= existingEventEndTime) ||
      // 3. New event completely overlaps an existing event
      (eventStartTime <= existingEventStartTime &&
        eventEndTime >= existingEventEndTime)
    );
  });

  // If there's a conflict, show an alert and return without adding the event
  if (hasConflict) {
    alert("You already have an event at this time");
    return;
  }

  // If there's no conflict, add the new event to the events list
  const newEvent = {
    name: eventName,
    startTime: eventStartTime.toISOString(),
    endTime: eventEndTime.toISOString(),
  };
  existingEvents.push(newEvent);

  // Save the updated events list to local storage
  localStorage.setItem("events", JSON.stringify(existingEvents));

  // Update the display of events
  displayEvents();
}

// Function to delete an event
function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  // Remove the event at the specified index from the events array
  events.splice(index, 1);
  // Save the updated events to local storage
  localStorage.setItem("events", JSON.stringify(events));
  // Display the updated list of events
  displayEvents();
}

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function displayEvents() {
  const eventList = document.getElementById("eventListCalendar");
  eventList.innerHTML = ""; // Clear previously displayed events

  const events = JSON.parse(localStorage.getItem("events")) || [];
  const currentTime = new Date(); // Current time

  // Split events into current and past events
  const currentEvents = [];
  const pastEvents = [];
  events.forEach((event) => {
    if (new Date(event.endTime) < currentTime) {
      pastEvents.push(event);
    } else {
      currentEvents.push(event);
    }
  });

  // Sort currentEvents by start time
  currentEvents.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  // Sort pastEvents by end time
  pastEvents.sort((a, b) => new Date(b.endTime) - new Date(a.endTime));

  // Display current events
  currentEvents.forEach((event, index) => {
    const listItem = createEventListItem(event, index);
    if (new Date(event.startTime) > currentTime) {
      listItem.classList.add("future-event"); // Add class for future events
    } else {
      listItem.classList.add("past-event"); // Add class for past events
    }
    eventList.appendChild(listItem);
  });

  // Display past events
  pastEvents.forEach((event, index) => {
    const listItem = createEventListItem(event, index + currentEvents.length);
    listItem.classList.add("past-event");
    eventList.appendChild(listItem);
  });

  // Event listener for delete buttons
  const deleteButtons = document.querySelectorAll(".delete-event");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(button.getAttribute("data-index"));
      deleteEvent(index);
    });
  });
}

// Add an event listener for the event form submission
document
  .getElementById("calendarForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission action

    // Call the function to add an event
    addEvent();
  });

// Function to create event list item
function createEventListItem(event, index) {
  const listItem = document.createElement("li");
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-event");
  deleteButton.setAttribute("data-index", index);
  listItem.textContent = `${event.name} - ${formatDate(
    new Date(event.startTime)
  )} to ${formatDate(new Date(event.endTime))}`;
  listItem.appendChild(deleteButton);
  return listItem;
}
