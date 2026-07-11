const scrubberTrack = document.querySelector('.scrubber-track-hourly');
const scrubberHandle = document.querySelector('.scrubber-handle');
const scrubberLabel = document.querySelector('.scrubber-label');

function generateHourlyTicks(hourlyTimes) {
  scrubberTrack.innerHTML = ''; // clear any existing ticks before regenerating

  hourlyTimes.forEach((time, index) => {
    const tick = document.createElement('div');
    tick.classList.add('scrubber-tick');

    const hour = new Date(time).getHours();
    if (hour === 0 || hour === 12) {
      tick.classList.add('major');
    }

    scrubberTrack.appendChild(tick);
  });

  scrubberTrack.appendChild(scrubberHandle); // re-append handle so it stays on top, inside the track
  scrubberTrack.appendChild(scrubberLabel);
}

let currentHourlyData = null; // we'll store the full weather.hourly object here for reuse

function positionHandleAtNow(hourlyTimes, currentTime) {
  const now = new Date(currentTime).getTime();
  const firstHour = new Date(hourlyTimes[0]).getTime();
  const lastHour = new Date(hourlyTimes[hourlyTimes.length - 1]).getTime();

  const progress = (now - firstHour) / (lastHour - firstHour);
  const clampedProgress = Math.max(0, Math.min(1, progress));

    console.log('now:', currentTime, 'firstHour:', hourlyTimes[0], 'lastHour:', hourlyTimes[hourlyTimes.length - 1], 'progress:', progress);
  scrubberHandle.style.top = `${clampedProgress * 100}%`;
}

let isDragging = false;

scrubberHandle.addEventListener('mousedown', (event) => {
  isDragging = true;
  event.preventDefault(); // stops accidental text-selection while dragging
});

window.addEventListener('mousemove', (event) => {
  if (!isDragging) return;

  const trackRect = scrubberTrack.getBoundingClientRect();
  const relativeY = event.clientY - trackRect.top;
  const progress = relativeY / trackRect.height;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  scrubberHandle.style.top = `${clampedProgress * 100}%`;

  // (next step: use this progress to update the scene + label)
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});