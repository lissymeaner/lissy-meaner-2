// When the DOM is fully parsed (but before images / styles finish loading),
// run this async function so we can safely access elements and use await.
document.addEventListener('DOMContentLoaded', async () => {
    //#region 1: Make a request that loads in the project from our own backend
    // Convert project JSON data to visible HTML/CSS components
    // 1. Capture the response value
    const response = await fetch('/api/projects');
    // 2. Turn it into JavaScript objects
    const projects = await response.json();
    
    // 3. Assign project list
    const projectList = document.getElementById('project-list');
    
    // Months: Refer back to this array for cards and modals
    const months = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"];

    // 4. Loop for each project,
    projects.forEach((project, index) => {
        
        // 5. Create the card that will hold the project preview, 
        // // and add class name "project" onto it;
        // // add the relevant tags from the project object,
        // // and set index based on order the project comes in
        // // the projects array.
        const projectContainer = document.createElement('div');
        projectContainer.classList.add('card', 'project');
        projectContainer.dataset.tags = JSON.stringify(project.tags);
        projectContainer.dataset.index = index;
        
        // 6. Populate the text part with innerText, or images with src
        // // Create the Photo tag (img),
        // // add the link to the source,
        // // slap it onto the card
        const photoTag = document.createElement('img');
        photoTag.classList.add('card-img-top');
        photoTag.src = project.photo;
        projectContainer.appendChild(photoTag);
        
        // 7. Create the card body that will be appended
        const projectContainerBody = document.createElement('div');
        projectContainerBody.classList.add('card-body');
        projectContainer.appendChild(projectContainerBody);
        
        // 8. Create the Title tag (h3)
        // // add the link to the source,
        // // then same as step 6.
        const titleTag = document.createElement('h3');
        titleTag.classList.add('card-title');
        titleTag.innerHTML = project.title;
        projectContainerBody.appendChild(titleTag);
        
        
        // // Do the same for Date as well.
        const dateTag = document.createElement('p');
        dateTag.classList.add('card-text', 'card-text-start-date');
        const dateTagDate = new Date(project.dates.dateStarted);
        const dateTagMonth = months[dateTagDate.getMonth()];
        const dateTagYear = dateTagDate.getFullYear();
        dateTag.innerHTML = `${dateTagMonth} ${dateTagYear}`;
        projectContainerBody.appendChild(dateTag);
        
        // 9. append project onto the list
        projectList.appendChild(projectContainer);
    });
    //#endregion
    
    //#region 2: Give .btn-tag buttons the functionality to filter out projects
    function filterProjects() {
        // 1. Gather all active tag buttons, store as an array
        const activeTags = document.querySelectorAll(".btn-tag.active");
        // 2. Convert all items into their inner HTML text, store as an array
        const activeTagsAsText = [...activeTags].map(btn => btn.textContent);
        // 3. Gather all project cards, store as an array
        const projects = document.querySelectorAll(".project");
        
        // 4. Loop for each project card
        projects.forEach(project => {
            // 5. Gather all of their tags, convert array string into object
            // // and add dataset tags
            const projectTags = JSON.parse(project.dataset.tags);
            
            // Additional functionality for the "All" button:
            // 6. If the user presses the "All" button,
            if (activeTagsAsText.includes("All")){
                // // go through each active tag
                activeTags.forEach(activeTag => {
                    // // that isn't "All", which is every
                    if (activeTag.innerHTML != "All"){
                        // // and remove them from the activeTag list
                        activeTag.classList.remove("active");
                    }
                });
                // // Once the list of active tags is empty,
                if(activeTagsAsText.length > 0){
                    // remove the active class from the "All" button
                    document.getElementById("all").classList.remove("active");
                }
            }
            
            // 7. Show or hide depending on whether one of the tags for the
            // // project has been selected by the user for filtering.
            if (activeTagsAsText.some(tag => projectTags.includes(tag)) || activeTagsAsText.includes("All") || activeTags.length == 0) {
                project.classList.remove("hidden");
            } else {
                project.classList.add("hidden");
            }
        });
    }
    
    // 8. Add event listeners to all buttons
    all.addEventListener('click', () => {all.classList.toggle("active"); filterProjects();})
    software.addEventListener('click', () => { software.classList.toggle("active"); filterProjects(); });
    cSharp.addEventListener('click', () => { cSharp.classList.toggle("active"); filterProjects(); });
    consoleApp.addEventListener('click', () => { consoleApp.classList.toggle("active"); filterProjects(); });
    htmlSite.addEventListener('click', () => { htmlSite.classList.toggle("active"); filterProjects(); });
    cssStyling.addEventListener('click', () => { cssStyling.classList.toggle("active"); filterProjects(); });
    js.addEventListener('click', () => { js.classList.toggle("active"); filterProjects(); });
    frontEnd.addEventListener('click', () => { frontEnd.classList.toggle("active"); filterProjects(); });
    backEnd.addEventListener('click', () => { backEnd.classList.toggle("active"); filterProjects(); });
    fullStack.addEventListener('click', () => { fullStack.classList.toggle("active"); filterProjects(); });
    webDev.addEventListener('click', () => { webDev.classList.toggle("active"); filterProjects(); });
    digitalArt.addEventListener('click', () => { digitalArt.classList.toggle("active"); filterProjects(); });
    
    
    ////////// FUNCTIONALITY FOR SCROLLER ////////////
    
    let mouseDown = false;
    let startX, scrollLeft;
    // 1. Assign variable to slider
    const slider = document.querySelector('.scroll-container');
    // 2. Assign variable to each direction button
    const btnLeft = document.querySelector('.left');
    const btnRight = document.querySelector('.right');
    // 3. Assign variable to the maximum scroll width
    let maxScrollLeft = slider.scrollWidth - slider.clientWidth;
    // 4. Assign arrow function variable for... 
    // // when the user starts dragging the scroller
    const startDragging = (e) => {
        mouseDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }
    // 5. Assign arrow function variable for... 
    // // when the user stops dragging the scroller
    const stopDragging = (e) => {
        mouseDown = false;
    }
    // 6. Assign arrow function variable for... 
    // // when the user is moving the scroller
    const move = (e) => {
        e.preventDefault();
        if (!mouseDown) { return; }
        const x = e.pageX - slider.offsetLeft;
        const scroll = x - startX;
        slider.scrollLeft = scrollLeft - scroll;
    }

    // 7. Add the event listeners for the slider
    slider.addEventListener('mousemove', move, false);
    slider.addEventListener('mousedown', startDragging, false);
    slider.addEventListener('mouseup', stopDragging, false);
    slider.addEventListener('mouseleave', stopDragging, false);
    // 8. Add event listener for scrolling using arrows
    slider.addEventListener('scroll', () => {
        // // logic when reaching start of slider
        if (slider.scrollLeft === 0 && !btnLeft.classList.contains('invisible')) {
            btnLeft.classList.add('invisible');
        } else { btnLeft.classList.remove('invisible'); }
        
        // // logic when reaching far end of slider
        if (slider.scrollLeft >= maxScrollLeft && !btnRight.classList.contains('invisible')) {
            btnRight.classList.add('invisible');
        } else { btnRight.classList.remove('invisible'); }
    })
    
    // 9. Add functionality for moving the slider to each button
    btnLeft.onclick = () => {
        slider.scrollLeft -= 20;
        // console.log(slider.scrollLeft);
    };

    btnRight.onclick = () => {
        slider.scrollLeft += 20;
        // console.log(slider.scrollLeft);
    };
    //#endregion

    //#region 3: Create a modal for each project in the list
    function populateModal(project){
        // 1. Populate the modal title with the project's title
        document.getElementById('modalTitle').textContent = project.title;

        // 2. Create the modal image,
        // // set the link as its source
        // // and set the project title as its alt text.
        const img = document.getElementById('modalImg');
        img.src = project.photo;
        img.alt = project.title;

        // 3. Assign variables 'Start' and 'End' for
        // // dates a project started and completed.
        let start = new Date(project.dates.dateStarted).toLocaleDateString('en-GB', { month: 'short', year: 'numeric'});
        let end = project.dates.dateCompleted ? new Date(project.dates.dateCompleted).toLocaleDateString('en-GB', { month: 'short', year: 'numeric'}) : 'Present';
        
        // 4. If the project is still ongoing, and isn't this website,
        if (!project.dates.dateCompleted && project.title !== "LISSY MEANER 2"){
            // // only show the start date.
            document.getElementById('modalDates').textContent = `${start}`;
        } // 5. Else if the project started and was completed in the same year,
        else if (start.substring(start.length - 4) == end.substring(end.length - 4)) {
            // // use the format 'Month–Month Year',
            // // by removing the year from the start date.
            document.getElementById('modalDates').textContent = `${start.substring(0, start.length - 5)}–${end}`;
        } // 6. Or else ...
        else {
            // // show the start and complete date
            // // that use the format 'Month Year – Month Year'.
            document.getElementById('modalDates').textContent = `${start} – ${end}`;
        } // 7. Show the project description
        document.getElementById('modalDescription').textContent = project.description;
    }
    
    // 8. Add a click event listener for each project inside the list
    // // that will display a modal.
    projectList.addEventListener('click', e => {
        const card = e.target.closest('.project');
        if (!card) return;
        const index = card.dataset.index;
        // // Use the populateModal function to show the modal.
        populateModal(projects[index]);
        bootstrap.Modal.getOrCreateInstance(document.getElementById('projectModal')).show();
    });
    //#endregion

    //#region 4: Switch buttons classes based on preferred colour scheme
    // 1. Assign boolean variable for whether if the user prefers the dark.
    let prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    
    // 2. Gather both buttons for directing the scroller
    const BUTTONS = document.querySelectorAll(".btn-light", ".btn-dark");
    
    // console.log(BUTTONS);
    
    // 3. Update the button theme based on preferred colour scheme
    function updateButtonTheme(e) {
        BUTTONS.forEach(btn => {
            if (e.matches) {
                // Logic for switching to Dark mode
                btn.classList.remove("btn-light");
                btn.classList.add("btn-dark");
            } else {
                // Logic for switching to Light mode
                btn.classList.remove("btn-dark");
                btn.classList.add("btn-light");
            }
        });
    }

    // 4. Initial load by taking prefersDark as parameter
    updateButtonTheme(prefersDark);

    // 5. Watch for changes
    prefersDark.addEventListener("change", updateButtonTheme);
    //#endregion
});

