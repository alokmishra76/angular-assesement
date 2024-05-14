import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Users } from './models/user.model';
import { FormValidator } from './form-validator/custom.form.validator';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-assesment';
  userLists: Users[] = [];
  userDetailsForm: FormGroup;
  update: boolean = false;
  isUserPresent: boolean = false;

  constructor() {
    this.userDetailsForm = new FormGroup({
      id: new FormControl(this.generateUniqueId()),
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", [Validators.required, FormValidator.phoneNumberValidator()])
    });
  }
  ngOnInit(): void {
    this.getUserData();
    this.generateUniqueId()
  }

  private getUserData() {
    this.userLists = this.getAllUserLists();
  }

  private generateUniqueId() {
    let myuuid = uuidv4();
    return myuuid
  }

  private get isUserListEmpty() {
    return localStorage.getItem('userData') === null ? false : localStorage.getItem('userData').length > 0;
  }

  public getAllUserLists() {
    return JSON.parse(localStorage.getItem('userData'));
  }

  private checkIfUserAlreadyExist(userList: Users[]) {
    const userInfo: Users = this.userDetailsForm.value;
    this.isUserPresent = false;
    userList.forEach(userData => {
       if(userData.email === userInfo.email) {
        debugger
          this.isUserPresent = true
       }
        if(userData.phone === userInfo.phone) {
        this.isUserPresent = true
       }
    })
  }

  private setUserData(oldUserList: Users[], userData: Users) {
    oldUserList.push(userData)
    localStorage.setItem('userData', JSON.stringify(oldUserList));
    this.isUserPresent = false;
    this.resetForm()
    this.getUserData();
  }

  public addUser() {
      const empInfo: Users = this.userDetailsForm.value;
      if(!this.isUserListEmpty) {
        const newUserArray: Users[] = [];
        newUserArray.push(empInfo);
        localStorage.setItem('userData', JSON.stringify(newUserArray));
      } else {
         const oldUserList:Users[] = this.getAllUserLists();
         this.checkIfUserAlreadyExist(oldUserList);
         this.isUserPresent === false ? this.setUserData(oldUserList, empInfo): null
      }
  }

  public resetForm() {
    this.userDetailsForm = new FormGroup({
      id: new FormControl(this.generateUniqueId()),
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", Validators.required)
    })
    this.update = false;
  }

  public get isFormValid() {
    return this.userDetailsForm.valid;
  }

  public editUser(user: Users) {
     this.update = true;
     this.userDetailsForm.setValue({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
     });
  }

  public updateUser() {
    let updatedUser: Users = this.userDetailsForm.value;
    const updatedUserList = this.userLists.map((data: Users) => {
     if(data.id === updatedUser.id) {
       return {
         ...data,
         name: updatedUser.name,
         email: updatedUser.email,
         phone: updatedUser.phone
       }
     } else{
       return data;
     }
    })
    localStorage.setItem('userData', JSON.stringify(updatedUserList));
    this.resetForm();
    this.update = false;
    this.getUserData();

  }

  public deleteUser(user: Users) {
    const result = window.confirm(`Are you Sure You want to delete ${user.name}`);
    if(result === true) {
      const filteredUserList = this.userLists.filter((res: Users) => res.id !== user.id);
      localStorage.setItem('userData', JSON.stringify(filteredUserList));
      this.getUserData();
    }
  }

  public sortColumn(columnName: string) {
    if(columnName === 'name') {
      this.userLists = this.userLists.sort((a, b) => a.name.localeCompare(b.name))
    }
    if(columnName === 'email') {
      this.userLists = this.userLists.sort((a, b) => a.email.localeCompare(b.email))
    }
  }
}
