using API.Database;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class MarkService : IMarkService
    {
        private DatabaseContext db;
        private const int MAX_COMMENT_LENGTH = 500;
        private IMonumentService monumentService;
        private IAuthService authService;

        public MarkService(DatabaseContext db, IMonumentService monumentService, IAuthService authService)
        {
            this.db = db;
            this.monumentService = monumentService;
            this.authService = authService;
        }

        public bool AddMark(int grade, string comment, long monumentId, string userName)
        {
            if (grade < 1 && grade > 5 || comment.Length > MAX_COMMENT_LENGTH)
                return false;

            var userId = authService.GetUserId(userName);

            var ifUserAddMarkBefore = db.Marks.Any(m => m.UserId == userId && m.MonumentId == monumentId);

            var isMonumentVerified = monumentService.IsMonumentVerified(monumentId);

            if (isMonumentVerified != true || ifUserAddMarkBefore)
                return false;

            db.Marks.Add(new Mark()
            {
                Comment = comment,
                Grade = grade,
                CreationDate = DateTime.Now,
                MonumentId = monumentId,
                UserId = userId
            });
            db.SaveChanges();

            UpdateAverageMark(monumentId);

            return true;
        }

        public bool EditMark(long markId, int grade, string comment, string userName)
        {
            if (grade < 1 && grade > 5 || comment.Length > MAX_COMMENT_LENGTH)
                return false;

            var mark = db.Marks.FirstOrDefault(m => m.Id == markId);

            var userId = authService.GetUserId(userName);
            var isUserAdmin = authService.IsUserAdmin(userName);

            if (mark == null || (userId != mark.UserId && !isUserAdmin))
                return false;

            mark.Grade = grade;
            mark.Comment = comment;
            mark.CreationDate = DateTime.Now;
            db.SaveChanges();

            UpdateAverageMark(mark.MonumentId);

            return true;
        }

        public void DeleteMark(long markId, string userId, bool isUserAdmin)
        {
            var mark = db.Marks.Find(markId);

            if (userId != mark.UserId && !isUserAdmin)
                return;

            var monumentId = mark.MonumentId;

            db.Marks.Remove(mark);
            db.SaveChanges();

            UpdateAverageMark(monumentId);
        }

        public void UpdateAverageMark(long monumentId)
        {
            var monument = db.Monuments.Include(m => m.Marks).FirstOrDefault(m => m.Id == monumentId);

            if (monument == null)
                return;

            decimal sum = 0;
            foreach(var mark in monument.Marks)
            {
                sum += mark.Grade;
            }
            int length = monument.Marks.Count;

            if (length > 0)
                monument.AverageMark = sum / length;
            else
                monument.AverageMark = 0;

            db.SaveChanges();
        }

        public List<Mark> GetYourMarks(string userName)
        {
            var userId = authService.GetUserId(userName);

            return db.Marks.Include(m => m.Monument).Where(m => m.UserId == userId).ToList();
        }
    }
}
