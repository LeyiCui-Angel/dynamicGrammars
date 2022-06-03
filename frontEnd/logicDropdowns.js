let ruleMap = ""
async function loadGrammar() {
    let grammarDef = await fetch(grammarFile) //grammarFile defined in .html
            .then(response => {return response.text();});
    
    let rules = grammarDef.trim().split("\n")

    rules = rules.reduce((rs, r) => {

        if (r.startsWith(" ")) { //any newlines need to be indented
            addedToRule = rs[rs.length - 1] + r
            return [...(rs.slice(0, -1)), addedToRule]
        }
        else {
            return [...rs, r]
        }
    }, []);

    ruleMap = new Map();
    rules.forEach(r => {
        let rule = r.split(" -> ");
        let left = rule[0]
        let right = rule[1].split(" | ").map(v => v.trim())
        ruleMap.set(left, right)
    });

}
loadGrammar();

function removeSelector(num) {
    if (num == 1) {
        if (document.getElementById("assumeSelector").children.length > 0) {
            document.getElementById("assumeSelector").removeChild(document.getElementById("assumeSelector").lastElementChild);
        }
    }
    if (num == 0) {
        if(document.getElementById("guaranteeSelector").children.length > 0) {
            document.getElementById("guaranteeSelector").removeChild(document.getElementById("guaranteeSelector").lastElementChild);
        }
    }
}
//function creates a selector element by appending it to
//existing selector div and adding it to the selector class
//separate selectors depending on if it resides in
//always assume or always guarantee (could simplify this)
function createSelector (num) {
    let semi = document.createElement('semi');
    semi.innerHTML = ";"

    var selector = document.createElement("div");
    selector.setAttribute("class", "selector");
    selector.appendChild(genDropdown(Array.from(ruleMap.keys())[0]));
    selector.appendChild(semi);

    if (num == 1) {
        document.getElementById("assumeSelector").appendChild(selector);
    }
    else if (num == 0) {
        document.getElementById("guaranteeSelector").appendChild(selector);
    }

}

function genDropdown(k) {
    let select = document.createElement('select');
    select.onchange = onchangeListener;
    ruleMap.get(k).forEach(elem => {
        let option = document.createElement('option');
        option.text = option.value = elem;
        select.add(option, 0);
    })

    select.selectedIndex = -1;
    return select;
}

//uses event.target.parentNode to access the selector that the listener
//is being called on, instead of a specific id
function onchangeListener(event) {
    //if rule if a simple non terminal
    if (ruleMap.has(this.value)) {
        event.target.parentNode.insertBefore(genDropdown(this.value), this);
    }
    //if rule combines non terminals
    else if (Array.from(ruleMap.keys()).map(l => (this.value).includes(l))) {
        //generate dropdowns for all nonterminals, and insert text as needed
        //expects rule components to be space seperated
        let newDropdowns = this.value.split(" ").map(e => {
            let replacementVal = document.createElement('span');
            //deal with spacing here
            replacementVal.innerHTML = " " + e.slice(1, -1) + " "
            Array.from(ruleMap.keys()).forEach(g => {
                if (g == e) {
                    replacementVal = genDropdown(g);
                }
            })
            return replacementVal;
        })

        if (newDropdowns.length > 1) {
            newDropdowns = addParens(newDropdowns)
        }

        newDropdowns.forEach(elem => {
            event.target.parentNode.insertBefore(elem, this);
        });

    }
    this.remove();
}

function addParens(ds) {
    const openParen = document.createElement('span')
    openParen.innerHTML = "("
    const closeParen = document.createElement('span')
    closeParen.innerHTML = ")"
    return [openParen, ...ds, closeParen]
}

//extract button and function, right now can only console.log logic
//should probably make a condition where you can only extract if there are no empty dropdowns
function download(text, name, type) {
    var a = document.getElementById("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
}

//add spacing here
function extractContent (assumeBody, guaranteeBody) {
    document.getElementById("a").style.visibility = "visible";
    let htmlBody = assumeBody + '\n' + guaranteeBody;
    console.log(htmlBody)
    const logicText = document.createElement('span')
    logicText.innerHTML = htmlBody;
    return logicText.innerText;
}

let extract = document.getElementById("extract")
extract.innerHTML = "Extract formula";
extract.onclick = function () {
    download(
        extractContent(
            document.getElementById("assume").innerText,
            document.getElementById("guarantee").innerText
        ),
        'logicspecs.tsl',
        'text/plain'
    )
}


//Create buttons for adding and removing new lines, calls
//create selector/remove selector function when button is clicked
let addButton1 = document.getElementById("addButton1");
addButton1.innerHTML = "+";
addButton1.onclick = function() {
    createSelector(1);
}

let addButton2 = document.getElementById("addButton2");
addButton2.innerHTML = "+";
addButton2.onclick = function() {
    createSelector(0);
}

let removeButton1 = document.getElementById("removeButton1");
removeButton1.innerHTML = "-";
removeButton1.onclick = function() {
    removeSelector(1);
}

let removeButton2 = document.getElementById("removeButton2");
removeButton2.innerHTML = "-";
removeButton2.onclick = function() {
    removeSelector(0);
}

    
