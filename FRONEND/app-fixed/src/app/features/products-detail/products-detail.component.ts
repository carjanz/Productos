import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-detail',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './products-detail.component.html',
  styleUrl: './products-detail.component.css'
})
export class ProductsDetailComponent implements OnInit {
  productId: string = '';

 

  constructor(private _route: ActivatedRoute) {}

  ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      this.productId = params.get('productId') || '';  
    });
  }
}
