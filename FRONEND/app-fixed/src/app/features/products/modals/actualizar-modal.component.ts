import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, Product } from '../../../core/services/products.service';

@Component({
  selector: 'app-actualizar-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h2 class="text-xl font-semibold mb-4">Actualizar Producto</h2>

        <label class="block mb-2">Nombre:</label>
        <input [(ngModel)]="producto.name" class="w-full border px-3 py-1 rounded mb-4" />

        <label class="block mb-2">Descripción:</label>
        <textarea [(ngModel)]="producto.description" class="w-full border px-3 py-2 rounded mb-4"></textarea>

        <div class="flex justify-end space-x-3">
          <button (click)="cerrar()" class="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancelar</button>
          <button (click)="guardar()" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  `
})
export class ActualizarModalComponent {
  @Input() producto!: Product;
  @Output() actualizado = new EventEmitter<Product>();

  constructor(private productsService: ProductsService) {}

  cerrar() {
    this.producto = { ...this.producto }; // reset local cambios si no se guardan
    this.actualizado.emit(); // cierra modal sin actualizar
  }

  guardar() {
    this.productsService.updateProduct(this.producto.id, {
      name: this.producto.name,
      description: this.producto.description
    }).subscribe({
      next: (updated) => {
        alert('✅ Producto actualizado desde el modal');
        this.actualizado.emit(updated);
      },
      error: (err) => {
        console.error('❌ Error al actualizar desde modal:', err);
        alert('Error al actualizar el producto');
      }
    });
  }
  modalActualizar: { visible: boolean; producto: Product | null } = {
  visible: false,
  producto: null
};

}
