using Microsoft.AspNetCore.SignalR;

namespace SignalR.Api.Hubs;

public class ApplicationHub : Hub<IHubClient>
{
    public async Task PublishBoughtProducts(string subscriptionId, Dictionary<string, int> boughtProducts)
    {
        await Clients.Users(subscriptionId).LoadBoughtProducts(boughtProducts);
    }
}
