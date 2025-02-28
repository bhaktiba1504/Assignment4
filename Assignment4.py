class EmployeeScheduler:
    def __init__(self):
        self.employees = {}
        self.schedule = {}
        self.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        self.shifts = ["morning", "afternoon", "evening"]
        self.max_employees = 6
        self.initialize_schedule()

    def add_employee(self, name, preferences):
        if len(self.employees) < self.max_employees and name not in self.employees:
            self.employees[name] = {"preferences": preferences, "assigned_days": 0}
            self.assign_shifts()
            self.resolve_conflicts()
            self.display_schedule()
        else:
           
            print("No employee works more than one shift per day!(Also every employee works only 5 days per week)")
            

    def initialize_schedule(self):
        for day in self.days:
            self.schedule[day] = {shift: [] for shift in self.shifts}

    def assign_shifts(self):
        for day in self.days:
            for name, data in self.employees.items():
                if data["assigned_days"] < 5:
                    assigned = False
                    for shift in data["preferences"]:
                        if len(self.schedule[day][shift]) < 2:
                            self.schedule[day][shift].append(name)
                            data["assigned_days"] += 1
                            assigned = True
                            break
                    
                    if not assigned:
                        for shift in self.shifts:
                            if len(self.schedule[day][shift]) < 2:
                                self.schedule[day][shift].append(name)
                                data["assigned_days"] += 1
                                break

    def resolve_conflicts(self):
        for day in self.days:
            for shift in self.shifts:
                while len(self.schedule[day][shift]) > 2:
                    employee = self.schedule[day][shift].pop()
                    self.assign_to_another_day(employee, day)

    def assign_to_another_day(self, employee, current_day):
        for day in self.days:
            if day != current_day and self.employees[employee]["assigned_days"] < 5:
                for shift in self.shifts:
                    if len(self.schedule[day][shift]) < 2:
                        self.schedule[day][shift].append(employee)
                        self.employees[employee]["assigned_days"] += 1
                        return

    def display_schedule(self):
        print("\nFinal Employee Schedule:")
        print(f"{'Day':<10}{'Morning':<20}{'Afternoon':<20}{'Evening':<20}")
        print("-" * 70)
        for day, shifts in self.schedule.items():
            print(f"{day:<10}{', '.join(shifts['morning']) or '-':<20}{', '.join(shifts['afternoon']) or '-':<20}{', '.join(shifts['evening']) or '-':<20}")

if __name__ == "__main__":
    scheduler = EmployeeScheduler()
    while len(scheduler.employees) < scheduler.max_employees:
        name = input("Enter employee name (or 'stop' to finish): ")
        if name.lower() == 'stop':
            break
        preferences = input("Enter preferred shifts (morning, afternoon, evening) separated by commas: ").split(',')
        preferences = [p.strip() for p in preferences]
        scheduler.add_employee(name, preferences)
