using Microsoft.AspNetCore.SignalR;
using SignalR.Api.Contracts;
using SignalR.Api.Hubs;
using SignalR.Api.Services;

var builder = WebApplication.CreateBuilder(args);
{
    builder.Services.AddSignalR();
    builder.Services.AddScoped<ProductsService>();
    builder.Services.AddSingleton<IUserIdProvider, QueryStringUserIdProvider>();

    // Allow any origin/header/method/credentials
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(
        builder =>
        {
            builder.SetIsOriginAllowed(_ => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
    });
}

var app = builder.Build();
{
    app.UseCors();
    app.MapHub<ApplicationHub>("/hub");
}

{
    app.MapGet("/products", (ProductsService productsService) =>
    {
        return Results.Ok(productsService.GetProducts());
    });

    app.MapPost("/products", (
        CreateProductRequest request,
        ProductsService productsService) =>
    {
        productsService.CreateProduct(request.Name, request.Price);
        return Results.Created();
    });
}

app.Run();
