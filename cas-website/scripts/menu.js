
function drop() {
    document.getElementById("myDropdown").classList.toggle("show");
    document.getElementById("myDropdown").classList.toggle("ind");
}

function fall() {
    document.getElementById("myDropdown2").classList.toggle("show");
    document.getElementById("myDropdown").classList.toggle("ind");
}

window.onclick = function(event) {
    if (!event.target.matches('#dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show2')) {
                openDropdown.classList.remove('show2');
            }
            if (openDropdown.classList.contains('ind')) {
                openDropdown.classList.remove('ind');
            }
        }
    }

    if (!event.target.matches('#dropbtn2')) {
            var dropdowns = document.getElementsByClassName("dropdown-content2");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show2')) {
                openDropdown.classList.remove('show2');
            }
            if (openDropdown.classList.contains('ind')) {
                openDropdown.classList.remove('ind');
            }
        }
    }
}