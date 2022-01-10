using API.Database;
using API.Models;
using API.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class BannedWordService : IBannedWordService
    {
        private DatabaseContext db;

        private const int PAGE_SIZE = 10;

        public BannedWordService(DatabaseContext db)
        {
            this.db = db;
        }

        public bool AddBannedWord(string bannedWord)
        {
            if (string.IsNullOrWhiteSpace(bannedWord))
                return false;

            var wordExists = db.BannedWords.Any(bw => bw.Word == bannedWord);

            if (wordExists)
                return false;


            db.BannedWords.Add(new BannedWord()
            {
                Word = bannedWord
            });
            db.SaveChanges();

            return true;
        }

        public void DeleteBannedWord(string bannedWord)
        {
            var word = db.BannedWords.Find(bannedWord);

            db.BannedWords.Remove(word);
            db.SaveChanges();
        }

        public ReturnedBannedWordsViewModel GetBannedWords(BannedWordFilterViewModel filters)
        {

            var words = db.BannedWords.Where(w => string.IsNullOrWhiteSpace(filters.Name) || w.Word.Contains(filters.Name));

            if (!filters.Descending)
                words = words.OrderBy(w => w.Word);
            else
                words = words.OrderByDescending(w => w.Word);

            if (filters.RenderPageNumber == null)
                return new ReturnedBannedWordsViewModel()
                {
                    PageNumber = 0,
                    AllPages = (int)Math.Ceiling(words.Count() / (double)PAGE_SIZE),
                    BannedWords = new List<BannedWord>()
                };

            long min = ((int)filters.RenderPageNumber - 1) * PAGE_SIZE;
            long max = ((int)filters.RenderPageNumber) * PAGE_SIZE;

            long i = 0;

            ReturnedBannedWordsViewModel wordsViewModel = new ReturnedBannedWordsViewModel()
            {
                AllPages = (int)Math.Ceiling(words.Count() / (double)PAGE_SIZE),
                BannedWords = new List<BannedWord>()
            };

            wordsViewModel.PageNumber = (int)filters.RenderPageNumber;

            foreach (var word in words)
            {
                if (i >= min && i < max)
                {
                    wordsViewModel.BannedWords.Add(word);
                }
                if (i >= max)
                    break;
                i++;
            }

            return wordsViewModel;
        }

        public List<BannedWord> DoesTextContainsBannedWords(string text)
        {
            var txt = text.ToLower();

            var bannedWords = db.BannedWords.ToList();

            var list = new List<BannedWord>();

            foreach(var word in bannedWords)
            {
                if (txt.Contains(word.Word.ToLower()))
                {
                    list.Add(word);
                }
            }

            return list;
        }
    }
}
