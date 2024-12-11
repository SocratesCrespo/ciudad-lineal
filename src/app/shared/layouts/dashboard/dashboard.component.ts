import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],

})
export class DashboardComponent implements OnInit {

  public sidebarWidth: string = 'sidebar-close';
  public dynamicWidth: number = 0;

  ngOnInit(): void {
    if (window.innerWidth > 1400) {
      this.dynamicWidth = 15; 
    }

    if (window.innerWidth > 992 && window.innerWidth < 1400 ) {
      this.dynamicWidth = 15; 
    }

    if (window.innerWidth > 768 && window.innerWidth < 992 ) {
      this.dynamicWidth = 25; 
    }

    if ( window.innerWidth > 576 && window.innerWidth < 768 ) {
      this.dynamicWidth = 30; 
    }

    if (  window.innerWidth < 576 ) {
      this.dynamicWidth = 10; 
    }
  }

  displayMenu(){
    if( this.sidebarWidth == 'sidebar-close' ){
      
      const interval = setInterval(() => {
        this.dynamicWidth = this.dynamicWidth + 5;
        if( this.dynamicWidth === 75 ){
          clearInterval(interval);
        }
      }, 1); 
      this.sidebarWidth = 'sidebar-open';
    }else{
      const interval = setInterval(() => {
        this.dynamicWidth = this.dynamicWidth - 5;
        if( this.dynamicWidth === 10 ){
          clearInterval(interval);
        }
      }, 1); 
      this.sidebarWidth = 'sidebar-close';
    }
  }

  closeMenu(){
    if (window.innerWidth > 576) {
      return;
    }
    const interval = setInterval(() => {
      this.dynamicWidth = this.dynamicWidth - 5;
      if( this.dynamicWidth === 10 ){
        clearInterval(interval);
      }
    }, 1); 
    this.sidebarWidth = 'sidebar-close';
  }

}
