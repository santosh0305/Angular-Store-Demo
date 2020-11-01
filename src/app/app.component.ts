import { Component, VERSION } from "@angular/core";
import { Observable } from "rxjs/internal/Observable";
import { Subscription } from "rxjs/internal/Subscription";
import { map } from "rxjs/operators";
import ToDoState from "./todo.state";
import { Store, select } from "@ngrx/store";
import { BeginCreateToDoAction, BeginGetToDoAction } from "./todo.action";
import ToDo from "./todo.model";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  todo$: Observable<ToDoState>;
  ToDoSubscription: Subscription;
  ToDoList: ToDo[] = [];

  Title: string = "";
  IsCompleted: boolean = false;

  todoError: Error = null;
  
  constructor(private store: Store<{ todos: ToDoState }>) {
    this.todo$ = store.pipe(select("todos"));
  }

  ngOnInit() {
    this.ToDoSubscription = this.todo$
      .pipe(
        map(x => {
          this.ToDoList = x.ToDos;
          this.todoError = x.ToDoError;
        })
      )
      .subscribe();

    //this.store.dispatch(ToDoAction.BeginGetToDoAction());
    this.store.dispatch(BeginGetToDoAction());
  }

  createToDo() {
    const todo: ToDo = { Title: this.Title, IsCompleted: this.IsCompleted };
    // this.store.dispatch(ToDoActions.BeginCreateToDoAction({ payload: todo }));
    this.store.dispatch(BeginCreateToDoAction({ payload: todo }));
    this.Title = "";
    this.IsCompleted = false;
  }

  ngOnDestroy() {
    if (this.ToDoSubscription) {
      this.ToDoSubscription.unsubscribe();
    }
  }
}
