using FixedsApp.Application.Common.Marker;

namespace FixedsApp.Infrastructure.Mailer
{
    public interface IMailService : ITransientService
    {
        Task SendAsync(MailRequest request);
    }
}
