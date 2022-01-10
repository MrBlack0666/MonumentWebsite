using API.Models;
using API.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IBannedWordService
    {
        bool AddBannedWord(string bannedWord);
        void DeleteBannedWord(string bannedWord);
        ReturnedBannedWordsViewModel GetBannedWords(BannedWordFilterViewModel filters);
        List<BannedWord> DoesTextContainsBannedWords(string text);
    }
}
