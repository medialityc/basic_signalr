namespace SignalR.Api.Hubs;

public interface IHubClient
{
    public Task LoadBoughtProducts(Dictionary<string, int> boughtProducts);
}
