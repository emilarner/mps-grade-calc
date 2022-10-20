/* 
Not going to use classes, since I am not fond of JavaScript, nor am I comfortable with it.
Additionally, this program isn't too complex--as of yet--to warrant such a high-level features.
*/

var criterions = {
    "A": {
        "currentGrades": [],
        "currentAverage": -1
    },
    "B": {
        "currentGrades": [],
        "currentAverage": -1
    },
    "C": {
        "currentGrades": [],
        "currentAverage": -1
    },
    "D": {
        "currentGrades": [],
        "currentAverage": -1
    }
};

const dp_spanish_french_criterions = [
    "E",
    "F",
    "G",
    "H",
    "I"
];

const randomCharacters = "@#%č^&æ*(è)(*ø?&ñ^%$#@ê7ç425ðë9325:~!@#";

var spanish_french_mode_times = 0;

const validCriterions = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

var currentCriterion = "A";

const AD = 4;
const PR = 3.2;
const BA = 2.1;
const MI = 1.1;
const O = 0;

const ADRange = [3.5, 4]
const PRRange = [2.5, 3.49]
const BARange = [1.5, 2.49]
const MIRange = [0.1, 1.49]


const A = [3.40, 4];
/*        ^^^ MPS made an error in their detailing of their standard's based grading algorithm.
Consider having an AD, PR, PR, and another PR.
AD = 4; PR = 3.2
However, the arithmetic mean of {4, 3.2, 3.2, 3.2} is 3.4.
On the document detailing the algorithm, the algorithm does not define a letter grade for 3.4,
since an A ranges from the domain of [3.405, 4.000] and a B ranges from [2.745, 3.390].
Hence, I have adjusted it, which should be mostly correct?
*/


const B = [2.745, 3.390];
const C = [2.145, 2.740];
const D = [1.595, 2.140];
const U = [0.000, 1.590];

/* Calculate the arithmetic mean of all of the grades in a list. */
function gradeAverage(grades)
{
    let sum = 0;
    for (var i = 0; i < grades.length; i++)
        sum += grades[i];
        
    let average = sum/grades.length;
    return average;
}

/* If a number, x, is within a range of two other numbers. */
function isBetween(x, range)
{
	return range[0] <= x && x <= range[1];
}

/* Using the above function and resources from MPS, determine the final letter grade. */
/* If it is outside of the domain described by MPS, undefined is returned */
/* (This should NOT happen.) */
function determineLetterGradeFromAverage(average)
{
    if (isBetween(average, A))
        return "A";
    
    else if (isBetween(average, B))
        return "B";
        
    else if (isBetween(average, C))
        return "C";
        
    else if (isBetween(average, D))
        return "D";
        
    else if (isBetween(average, U))
        return "U";
        
    else
        return undefined; 
}

/* Given all criterions, calculate averages and display the letter grade. */
function determineLetterGrade()
{
    let localSum = 0;
    let numberOfCriterions = 0;

    for (const criterion in criterions)
    {
        if (criterions[criterion]["currentAverage"] == -1)
            continue;

        localSum += determineCriterionGrade(criterions[criterion]["currentAverage"]);
        numberOfCriterions++;
    }

    let average = parseFloat((localSum/numberOfCriterions).toFixed(3));
    console.log(average);
    
    return determineLetterGradeFromAverage(average);
}

/* Turn a numerical criterion grade into its string equivalent. */
function criterionGradeToString(grade)
{
	switch (grade)
    {
        case AD:
            return "AD";
        
        case PR:
            return "PR";
        
        case BA:
            return "BA";
        
        case MI:
            return "MI";
        
        case O:
            return "O";
    }
}

/* Determine the criterion's average grade. Note, it is not as simple as it looks... */
function determineCriterionGrade(average)
{
    if (isBetween(average, ADRange))
        return AD;

    else if (isBetween(average, PRRange))
        return PR;

    else if (isBetween(average, BARange))
        return BA;

    else if (isBetween(average, MIRange))
        return MI;

    else
        return O;
}

/* Show the grades of the criterion. */
function showGrades(criterion)
{
    /* Clear the fucking grade list. */
    document.getElementById("grades").innerHTML = "";

    let currentGrades = criterions[criterion]["currentGrades"];

    console.log(criterions[criterion]["currentGrades"]);

    /* NULL amount of grades. */
    /* This is buggy, for some reason. */
    if (currentGrades.length == 0)
    {
        document.getElementById("grades").innerHTML = "<h3 style='font-style: italic;'>No Grades To Be Shown</h3>";
    }

    /* Go through all of the grades in the criterion. */ 
    for (let i = 0; i < currentGrades.length; i++)
    {
        let grade = currentGrades[i];
        let gradeString = criterionGradeToString(grade);

        let element = document.createElement("div");
        element.className = "grade type-" + criterionGradeToString(grade);
        element.id = (i+1).toString();
        
        element.appendChild(document.createTextNode(criterionGradeToString(grade)));
        
        document.getElementById("grades").appendChild(element);
    }
}

/* Change the current criterion being operated on, displaying its grades. */
function changeCriterion(crit)
{
    /* This should theoretically never happen; alas, I don't want to risk it. */
    if (!(crit in criterions))
    {
        alert("Critical Error: the criterion you are referencing does not exist...");
        return;
    }

    /* Update the UI. */
    document.getElementById("criterion-name").innerText = `Currently operating on criterion ${crit}:`;
    currentCriterion = crit;
    showGrades(currentCriterion);
}

/* Add a criterion by its letter--without sanity checking--and update the UI. */
function addCriterionByValue(crit)
{
    let newElement = document.createElement("button");
    newElement.onclick = function() { changeCriterion(crit); };
    newElement.className = "criterion-button";
    newElement.innerText = `Criterion ${crit}`;

    criterions[crit] = {
        "currentGrades": [],
        "currentAverage": -1
    };


    document.getElementById("choose-criterions").appendChild(newElement);
}

/* Add a criterion to the grade calculation system by prompting the user.*/
function addCriterion()
{
    let crit = prompt("Enter in the criterion letter: ");

    if (crit.length > 1 || crit.length == 0)
    {
        alert(`'${crit}' is too long for a letter!`);
        return;
    }

    if (!validCriterions.includes(crit))
    {
        alert(
            `Your '${crit}' criterion is not a valid letter (it must be uppercase, without diacritics, and in the Latin alphabet).`
        );
        return;
    }

    if (crit in criterions)
    {
        alert("The criterion already exists, not wasting time by adding it again...");
        return;
    }

    addCriterionByValue(crit);
}

/* Emulates a synchronous sleep() call as found in C and/or Python. */
// taken from https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep bc lazy
function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* Automatically adds criterions for DP French or DP Spanish classes. */
/* Also, it has a fun easter egg in it, if you keep abusing it. */
async function dp_spanish_french_mode()
{
    for (let i = 0; i < dp_spanish_french_criterions.length; i++)
    {
        let letter = spanish_french_mode_times < 1 ? 
                    dp_spanish_french_criterions[i] : 
                    randomCharacters[Math.floor(Math.random() * randomCharacters.length)];

        for (let i = 0; i <= spanish_french_mode_times; i++)
            addCriterionByValue(letter);
    }

    spanish_french_mode_times++;

    if (spanish_french_mode_times == 3)
        alert("You've discovered an intentional bug! Good job! Probably you should refresh");

    /* Make it recursively call itself in a loop exponentially faster at this point. */
    /* This may crash your computer, if it lacks the sufficient resources. */
    if (spanish_french_mode_times == 6)
    {
        let initial_time = 2000;
        let decay_constant = .80;

        for (let i = 0; i < 1000; i++)
        {
            dp_spanish_french_mode();
            await sleep(initial_time * Math.pow(decay_constant, i));
        }
    }
}

/* Remove the latest grade from the current criterion, then update the table. */
function popGrade()
{
    //document.getElementById(criterions[currentCriterion]["currentGrades"].length.toString()).remove();
    criterions[currentCriterion]["currentGrades"].pop();
    let currentGrades = criterions[currentCriterion]["currentGrades"];
    criterions[currentCriterion]["currentAverage"] = gradeAverage(currentGrades);

    let finalLetterGrade = determineLetterGrade();
    
    document.getElementById("lettergrade").className = "final-grade type-" + finalLetterGrade; 
    document.getElementById("lettergrade").innerText = finalLetterGrade;

    showGrades();
}

/* Add a grade, in numerical format, to the current criterion and calculate averages. */ 
function addGrade(grade)
{
    criterions[currentCriterion]["currentGrades"].push(grade);
    let currentGrades = criterions[currentCriterion]["currentGrades"];
    criterions[currentCriterion]["currentAverage"] = gradeAverage(currentGrades);

    showGrades(currentCriterion);

    let finalLetterGrade = determineLetterGrade();
    document.getElementById("lettergrade").className = "final-grade type-" + finalLetterGrade; 
    document.getElementById("lettergrade").innerText = finalLetterGrade;
}
