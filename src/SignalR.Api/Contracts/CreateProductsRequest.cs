namespace SignalR.Api.Contracts;

public record CreateProductRequest(
    string Name,
    decimal Price
);
