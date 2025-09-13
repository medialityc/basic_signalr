using SignalR.Api.Domain;

namespace SignalR.Api.Services;

public class ProductsService
{
    public static List<Product> _products = [
        new()
        {
            Id = Guid.NewGuid(),
            Name = "Rice",
            Price = 5,
        },
        new()
        {
            Id = Guid.NewGuid(),
            Name = "Beans",
            Price = 10,
        },
        new()
        {
            Id = Guid.NewGuid(),
            Name = "Eggs",
            Price = 5,
        },
        new()
        {
            Id = Guid.NewGuid(),
            Name = "Milk",
            Price = 7,
        },
    ];

    public void CreateProduct(string name, decimal price)
    {
        var product = new Product()
        {
            Id = Guid.NewGuid(),
            Name = name,
            Price = price
        };
        _products.Add(product);
    }

    public IEnumerable<Product> GetProducts() => _products;
}
