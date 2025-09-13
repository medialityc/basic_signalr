using Microsoft.AspNetCore.SignalR;

namespace SignalR.Api.Hubs;

public class QueryStringUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        // Get the HttpContext from the hub connection.
        var httpContext = connection.GetHttpContext() ?? throw new Exception("Cannot access the http-context");

        if (httpContext.Request.Query.TryGetValue("subscriptionId", out var subscriptionId))
            return subscriptionId.FirstOrDefault()!;
        else
            return string.Empty;
    }
}
