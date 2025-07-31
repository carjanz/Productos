import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsService, Product } from '../../core/services/products.service';
import { FormsModule } from '@angular/forms';
import { ActualizarModalComponent } from './modals/actualizar-modal.component';

interface ProductEditable extends Product {
  editing?: boolean;
}

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [CommonModule, FormsModule, ActualizarModalComponent]
})
export class ProductsComponent implements OnInit {
consultarProducto(_t79: ProductEditable) {
throw new Error('Method not implemented.');
}
  products: ProductEditable[] = [];
  cargando = false;
  error: string | null = null;
  modalActualizar: { visible: boolean; producto: ProductEditable | null } | null = null;

  private readonly productsService = inject(ProductsService);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.cargando = true;
    this.error = null;

    this.productsService.getProducts().subscribe({
      next: (response) => {
        this.products = this.parseResponse(response);
        this.cargando = false;
      },
      error: (err: HttpErrorResponse) => this.handleError(err),
    });
  }

  parseResponse(response: any): ProductEditable[] {
    return Array.isArray(response) ? response : response?.data || [];
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      this.productsService.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
      });
    }
  }

  toggleEditar(product: ProductEditable): void {
    if (product.editing) {
      this.productsService.updateProduct(product.id, product).subscribe(() => {
        product.editing = false;
      });
    } else {
      product.editing = true;
    }
  }

  abrirModal(product: ProductEditable): void {
    this.modalActualizar = { visible: true, producto: product };
  }

  actualizarEnLista(productoActualizado: Product): void {
    const index = this.products.findIndex(p => p.id === productoActualizado.id);
    if (index >= 0) {
      this.products[index] = { ...productoActualizado };
    }
    this.modalActualizar = null;
  }

  handleError(err: HttpErrorResponse): void {
    this.cargando = false;
    this.error = err.status === 401 ? 'No autorizado. Por favor inicie sesión nuevamente.' :
      err.status === 404 ? 'No se encontraron productos.' :
      err.error?.message || err.message || 'Ocurrió un error inesperado.';
  }
}
