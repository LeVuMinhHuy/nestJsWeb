import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { CrudService } from '../crud.service';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userForm: FormGroup;
  users: User[] = [];
  stateButton = false;

  constructor(
    public fb: FormBuilder,
    public crudService: CrudService,
  ) {}

  ngOnInit(): void {
    this.newForm();

    this.crudService.getAll().subscribe((data: User[]) => {
      console.log(data)
      if (data !== null){
        this.users = data;
      }

      console.log(this.users)
    });
  }

  newForm(){
    this.userForm = this.fb.group({
      id : [''],
      email : [''],
      firstName: [''],
      lastName: [''],
      avatar: [''],
    });
  }

  checkSubmit(user){
    this.stateButton = true;
    if ( user.id === '' ) {
      this.create(user);
    }
    else {
      this.update(user);
    }

    this.newForm();
  }

  getUserUpdate(user){
    this.userForm = this.fb.group(user) // get info of user for updating
  }

  create(user){
    if(this.users.length > 0){
      user.id = this.users[this.users.length - 1].id + 1;
    }
    else {
      user.id = 1
    }

    // wrong: new id from length of users list + 1
    // => create user.id = 8, 9, delete user.id = 8 (length now = 8), then new user has id = 9 again.
    // correct: new id with last user id

    this.crudService.create(user).subscribe(res => {
        if (res !== null){
          this.users.push(res);
          this.stateButton = false;
          console.log('User created!');
        }
      }
    );
  }

  update(user){
    this.crudService.update(user.id, user).subscribe(res => {
      if (res != null){
        // update by user json (not by length - 1 <- cause bug)
        const userUpdate = this.users.find(i => i.id === user.id);
        if (userUpdate) {
          const index = this.users.indexOf(userUpdate, 0);
          this.users.splice(index, 1, user);
        }
      };
      this.stateButton = false;
      console.log('User updated!');
    });
  }

  delete(user){
    this.crudService.delete(user.id).subscribe(res => {
        const index = this.users.indexOf(user, 0);
        if (index > -1) {
          this.users.splice(index, 1);
        }
        console.log('User delelted!');
    });
  }
}



