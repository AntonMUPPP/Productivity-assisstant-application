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
    alert("You have already an event at this time");
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

// Function to display events in the calendar window
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

  // Display current events
  if (currentEvents.length > 0) {
    const currentEventsHeader = document.createElement("h3");
    currentEventsHeader.textContent = "Current Events";
    eventList.appendChild(currentEventsHeader);
    currentEvents.forEach((event) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${event.name} - ${event.startTime} to ${event.endTime}`;
      eventList.appendChild(listItem);
    });
  }

  // Display past events
  if (pastEvents.length > 0) {
    const pastEventsHeader = document.createElement("h3");
    pastEventsHeader.textContent = "Past Events";
    eventList.appendChild(pastEventsHeader);
    pastEvents.forEach((event) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${event.name} - ${event.startTime} to ${event.endTime}`;
      eventList.appendChild(listItem);
    });
  }
}

// Add an event listener for the event form submission
document
  .getElementById("calendarForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission action

    // Call the function to add an event
    addEvent();
  });
