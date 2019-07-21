import { Component } from '@angular/core';

@Component({
  selector: 'plugin-component',
  template: `<h3>Hi, I am the Plugin A component.</h3>`
})
export class PluginComponent {
  constructor() { 
      console.log("Hi, I am the Plugin component.");
  }
}