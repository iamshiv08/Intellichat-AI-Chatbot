
// const counters = document.querySelectorAll(".counters span");

// // Array to track if the counter has been activated
// let activated = Array(counters.length).fill(false);

// window.addEventListener("scroll", () => {
//     // Loop through all counters
//     counters.forEach((counter, index) => {
//         const container = counter.closest(".counter"); // Find the closest counter element
//         const rect = container.getBoundingClientRect(); // Get the position of the counter container

//         // Check if the container is in view
//         if (rect.top <= window.innerHeight - 150 && !activated[index]) {
//             activated[index] = true; // Mark this counter as activated

//             let count = 0;
//             const target = parseInt(counter.dataset.count); // Get the target count

//             function updateCount() {
//                 if (count < target) {
//                     count++;
//                     counter.innerText = count;
//                     setTimeout(updateCount,10);
//                 } else {
//                     counter.innerText = target;
//                 }
//             }

//             updateCount(); // Start the count animation
//         }
//     });
// });
