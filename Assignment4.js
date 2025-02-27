
class EmployeeScheduler {
    
    constructor() {
        this.employees = {};
        this.schedule = {};
        this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        this.shifts = ["morning", "afternoon", "evening"];
        this.maxEmployees = 6;
        this.initializeSchedule();
    }

    

    addEmployee(name, preferences) {
        if (Object.keys(this.employees).length < this.maxEmployees && !this.employees[name]) {
            this.employees[name] = { preferences, assignedDays: 0 };
            this.assignShifts();
            this.resolveConflicts();
            this.displaySchedule();
        } else {
            alert("No employee works more than one shift per day!(Also every employee works only 5 days per week)");
            
        }
    }

    initializeSchedule() {
        this.days.forEach(day => {
            this.schedule[day] = {
                morning: [],
                afternoon: [],
                evening: []
            };
        });
    }

    
    assignShifts() {
        for (const day of this.days) {
            for (const [name, data] of Object.entries(this.employees)) {
                if (data.assignedDays < 5) {
                    let assigned = false;
                    for (const shift of data.preferences) {
                        if (this.schedule[day][shift].length < 2) {
                            this.schedule[day][shift].push(name);
                            data.assignedDays++;
                            assigned = true;
                            break;
                        }
                    }
                    
                    if (!assigned) {
                        for (const shift of this.shifts) {
                            if (this.schedule[day][shift].length < 2) {
                                this.schedule[day][shift].push(name);
                                data.assignedDays++;
                                break;
                            }
                        }
                    }
                }
                
            }
        }
    }
   
    resolveConflicts() {
        for (const day of this.days) {
            for (const shift of this.shifts) {
                while (this.schedule[day][shift].length > 2) {
                    const employee = this.schedule[day][shift].pop();
                    this.assignToAnotherDay(employee, day);
                }
            }
        }
    }
    
    assignToAnotherDay(employee, currentDay) {
        for (const day of this.days) {
            if (day !== currentDay && this.employees[employee].assignedDays < 5) {
                for (const shift of this.shifts) {
                    if (this.schedule[day][shift].length < 2) {
                        this.schedule[day][shift].push(employee);
                        this.employees[employee].assignedDays++;
                        return;
                    }
                }
            }
        }
    }
    


    displaySchedule() {
        const scheduleContainer = document.getElementById("schedule");
        scheduleContainer.innerHTML = "<h2>Final Employee Schedule:</h2>";
        const table = document.createElement("table");
        table.innerHTML = `<tr><th>Day</th><th>Morning</th><th>Afternoon</th><th>Evening</th></tr>`;
        
        for (const [day, shifts] of Object.entries(this.schedule)) {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${day}</td><td>${shifts.morning.join(", ") || "-"}</td><td>${shifts.afternoon.join(", ") || "-"}</td><td>${shifts.evening.join(", ") || "-"}</td>`;
            table.appendChild(row);
        }
        scheduleContainer.appendChild(table);
    }
}



const scheduler = new EmployeeScheduler();

document.getElementById("addEmployee").addEventListener("click", () => {
    const name = document.getElementById("employeeName").value;
    const preferences = Array.from(document.querySelectorAll("input[name='shift']:checked")).map(input => input.value);
    if (name && preferences.length > 0) {
        scheduler.addEmployee(name, preferences);
    }
});

document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("employeeName").value = ""; // Clears the textbox
    document.getElementById("myCheckbox").checked = false;
    document.getElementById("myCheckbox1").checked = false;
    document.getElementById("myCheckbox2").checked = false;
});
