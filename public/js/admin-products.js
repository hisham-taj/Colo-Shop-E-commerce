// public/js/admin-products.js
document.addEventListener('DOMContentLoaded', () => {
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductForm = document.getElementById('addProductForm');
    const editProductForm = document.getElementById('editProductForm');
    const newProductForm = document.getElementById('newProductForm');
    const updateProductForm = document.getElementById('updateProductForm');
  
    addProductBtn.addEventListener('click', () => {
      addProductForm.style.display = 'block';
    });
  
    newProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(newProductForm);
      const response = await fetch('/admin/products', {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        location.reload();
      } else {
        alert('Failed to add product');
      }
    });
  
    updateProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(updateProductForm);
      const productId = formData.get('id');
      const response = await fetch(`/admin/products/${productId}`, {
        method: 'PUT',
        body: formData
      });
      if (response.ok) {
        location.reload();
      } else {
        alert('Failed to update product');
      }
    });
  });
  
  function editProduct(productId) {
    fetch(`/admin/products/${productId}`)
      .then(response => response.json())
      .then(product => {
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductDescription').value = product.description;
        document.getElementById('editProductForm').style.display = 'block';
      });
  }
  
  function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
      fetch(`/admin/products/${productId}`, { method: 'DELETE' })
        .then(response => {
          if (response.ok) {
            location.reload();
          } else {
            alert('Failed to delete product');
          }
        });
    }
  }
  
  function cancelAddProduct() {
    document.getElementById('addProductForm').style.display = 'none';
    document.getElementById('newProductForm').reset();
  }
  
  function cancelEditProduct() {
    document.getElementById('editProductForm').style.display = 'none';
    document.getElementById('updateProductForm').reset();
  }