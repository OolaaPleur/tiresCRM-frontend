import {Component} from '@angular/core';
import {TaskEntity, TaskType, TireEntity, TiresService} from "../service/tires.service";
import {DatePipe} from "@angular/common";
import {format, utcToZonedTime } from 'date-fns-tz';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../service/auth/auth.service";

@Component({
  selector: 'app-tire-list',
  templateUrl: './tire-list.component.html',
  styleUrls: ['./tire-list.component.css']
})
export class TireListComponent {
  tires: TireEntity[] = [];
  updatedLotNumbers: string[] = [];

  // Inside your Component class
  displayStatus: boolean[][] = []; // Initialize with the first checkbox to be displayed
  disabledStatus: boolean[][] = [];

  constructor(private authService: AuthService, private tireService: TiresService, private datePipe: DatePipe, private route: ActivatedRoute, private router: Router,) {
    console.log(this.router.routerState.snapshot);
    this.tireService.tires$.subscribe(tires => {
      this.tires = tires;
      this.updatedLotNumbers = tires.map(tire => tire.lotNumber);
      this.tireService.tires$.subscribe(tires => {
        this.tires = tires;
        this.updatedLotNumbers = tires.map(tire => tire.lotNumber);
        this.displayStatus = tires.map(tire => {
          const taskCount = Object.keys(TaskType).length;
          const arr = Array(taskCount).fill(false); // Initialize all to false


          if (tire.tasks) {
            // Set other elements based on server data
            tire.tasks.forEach(task => {
              const taskTypeIndex = Object.values(TaskType).indexOf(task.taskType!);
              if (taskTypeIndex !== -1 && task.isDone) {
                arr[taskTypeIndex] = true;
              }
            });

            // Find the first 'false' and set it to 'true'
            for (let i = 0; i < arr.length; i++) {
              if (!arr[i]) {
                arr[i] = true;
                break; // Exit the loop as soon as we find the first 'false'
              }
            }
          }

          return arr;
        });
        this.generateDisabledStatus();

      });


    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const date = params.get('date');
      console.log(params)
      if (date) {
        this.tireService.getTiresByDate(date).subscribe(data => {
          this.tireService.updateTires(data);
        });
      } else {
        this.tireService.fetchAndUpdateTires();
      }
    });
  }

  formatDate(dateString: string): string {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDate = utcToZonedTime(dateString, timeZone);

    const today = new Date();
    const zonedToday = utcToZonedTime(today.toISOString(), timeZone);

    if (zonedToday.toDateString() === zonedDate.toDateString()) {
      // If the date is today, return time in HH:mm format
      return format(zonedDate, 'HH:mm', { timeZone });
    } else {
      // Otherwise, return date and time in yyyy-MM-dd HH:mm format
      return format(zonedDate, 'yyyy-MM-dd HH:mm', { timeZone });
    }
  }

  updateDisplayStatus(tireIndex: number) {
    const taskTypes = Object.values(TaskType); // ['blowingTire', 'checkingTire', 'removingOldTread']
    let showNext = true;

    // Step 1: Update displayStatus based on server data or user actions
    for (let taskTypeIndex = 0; taskTypeIndex < taskTypes.length; taskTypeIndex++) {
      const taskType = taskTypes[taskTypeIndex];

      if (showNext) {
        this.displayStatus[tireIndex][taskTypeIndex] = true;
      } else {
        this.displayStatus[tireIndex][taskTypeIndex] = false;
      }

      if (!this.getTaskStatus(tireIndex, taskType)) {
        showNext = false;
      }
    }

    // Update disabledStatus based on the updated displayStatus
    // for (let taskTypeIndex = 0; taskTypeIndex < taskTypes.length; taskTypeIndex++) {
    //   this.disabledStatus[tireIndex][taskTypeIndex] = !this.canUncheckCheckbox(tireIndex, taskTypeIndex);
    // }

    this.updateDisabledStatusForTire(tireIndex);

    console.log(JSON.stringify(this.disabledStatus));
  }

  updateDisabledStatusForTire(tireIndex: number) {
    this.disabledStatus[tireIndex] = this.generateDisabledStatusForTire(tireIndex);
  }

  generateDisabledStatus() {
    this.disabledStatus = Array(this.tires.length).fill(null).map((_, tireIndex) => {
      return this.generateDisabledStatusForTire(tireIndex);
    });
  }

  generateDisabledStatusForTire(tireIndex: number): boolean[] {
    const taskTypes = Object.values(TaskType);
    const lastTaskType = taskTypes[taskTypes.length - 1];
    const disabledStatusForCurrentTire = Array(taskTypes.length).fill(false);

    for (let taskTypeIndex = 0; taskTypeIndex < taskTypes.length; taskTypeIndex++) {
      const currentTaskType = taskTypes[taskTypeIndex];

      if (this.displayStatus[tireIndex][taskTypeIndex]) {
        const prevIndex = taskTypeIndex - 2;
        if (prevIndex >= 0) {
          disabledStatusForCurrentTire[prevIndex] = true;
        }
      }

      if (currentTaskType === lastTaskType && this.getTaskStatus(tireIndex, lastTaskType)) {
        const prevIndex = taskTypeIndex - 1;
        if (prevIndex >= 0) {
          disabledStatusForCurrentTire[prevIndex] = true;
        }
      }
    }

    return disabledStatusForCurrentTire;
  }


  getTaskStatus(tireIndex: number, taskType: TaskType): boolean {
    const tire = this.tires[tireIndex];
    if (!tire || !tire.tasks) {
      return false;
    }
    const task = tire.tasks.find(t => t.taskType === taskType);
    return task ? task.isDone ?? false : false;
  }


  onLotNumberSubmitted(index: number, event: Event) {
    const input = (event as KeyboardEvent).target as HTMLInputElement;
    if (input !== null) {
      this.updateTireField(index, 'lotNumber', input.value, input);
    }
  }

  updateTaskField(index: number, taskType: TaskType, fieldName: keyof TaskEntity, value?: any, inputElem?: HTMLInputElement) {
    const tire = this.tires[index];
    if (!tire || !tire.tasks) {
      return;
    }
    const task = tire.tasks.find(t => t.taskType === taskType);

    if (task) {
      let previousValue = task[fieldName];
      if (typeof previousValue === 'boolean') {
        (task[fieldName] as boolean) = !previousValue;
      } else if (typeof previousValue === 'string') {
        (task[fieldName] as string) = value;
      } else if (typeof previousValue === 'number') {
        // Handle number fields here
      }
      task.whoDidIt = this.authService.getAuthenticatedUser() ?? 'worker_error'; //TODO remove when added auth
      const currentDate = new Date();
      task.whenWasItDone = currentDate.toISOString();

      this.tireService.updateTire(tire.id, tire).subscribe({
        next: (res) => {
          this.tires[index] = res;
          if (inputElem && typeof value === 'string') {
            console.log('successs ' + value);
            inputElem.value = value;  // Set the input field's value
            this.updatedLotNumbers[index] = res.lotNumber;
          }
        },
        error: (err) => {
          console.error('Failed to update the tire', err);
          // Revert the change in case of error
          if (typeof previousValue === 'boolean') {
            (task[fieldName] as boolean) = previousValue;
          } else if (typeof previousValue === 'string') {
            (task[fieldName] as string) = previousValue;
          } else if (typeof previousValue === 'number') {
            // Handle number fields here
          }
        }
      });
    }
  }

  updateTireField(index: number, fieldName: keyof TireEntity, value?: any, inputElem?: HTMLInputElement) {
    const field = this.tires[index][fieldName];
    let previousValue: any = this.tires[index][fieldName];

    if (typeof field === 'boolean') {
      (this.tires[index][fieldName] as boolean) = !field;
    } else if (typeof field === 'string') {
      (this.tires[index][fieldName] as string) = value;
    } else if (typeof field === 'number') {
      // Handle number fields here
    }

    this.tireService.updateTire(this.tires[index].id, this.tires[index]).subscribe({
      next: (res) => {
        this.tires[index] = res;
        if (inputElem && typeof value === 'string') {
          console.log('successs ' + value);
          inputElem.value = value;  // Set the input field's value
          this.updatedLotNumbers[index] = res.lotNumber;
        }
      },
      error: (err) => {
        console.error('Failed to update the tire', err);
        // Revert the change in case of error
        if (typeof field === 'boolean') {
          (this.tires[index][fieldName] as boolean) = field;
        } else if (typeof field === 'string') {
          (this.tires[index][fieldName] as string) = previousValue;
        } else if (typeof field === 'number') {
          // Handle number fields here
        }
      }
    });
  }

  addTire() {
    this.tireService.addTire().subscribe((newTire: any) => {
      this.tireService.updateTires([...this.tireService.tiresValue, newTire]); // Spread existing value and append new tire
    });
  }

  protected readonly TaskType = TaskType;
}
