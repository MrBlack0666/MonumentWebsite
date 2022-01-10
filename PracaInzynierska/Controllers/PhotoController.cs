using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Models;
using API.Services;
using API.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private IPhotoService photoService;
        public PhotoController(IPhotoService photoService)
        {
            this.photoService = photoService;
        }

        [Route("addnewphoto")]
        [HttpPost]
        public IActionResult AddNewPhoto([FromForm] NewPhotoViewModel newPhoto)
        {
            try
            {
                var result = photoService.AddNewPhoto(newPhoto.MonumentId, newPhoto.NewPhoto, newPhoto.Source);
                return result ? (IActionResult)Ok() : NotFound();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("addoldphoto")]
        [HttpPost]
        public IActionResult AddOldPhoto([FromForm] OldPhotoViewModel oldPhoto)
        {
            try
            {
                var result = photoService.AddOldPhoto(oldPhoto.MonumentId, oldPhoto.OldPhoto, oldPhoto.Date, oldPhoto.Source);
                return result ? (IActionResult)Ok() : NotFound();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("deletenewphoto")]
        [HttpPost]
        public IActionResult DeleteNewPhoto([FromBody] long id)
        {
            try
            {
                photoService.DeleteNewPhoto(id);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("deleteoldphoto")]
        [HttpPost]
        public IActionResult DeleteOldPhoto([FromBody] long id)
        {
            try
            {
                photoService.DeleteOldPhoto(id);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getnewphotos/{monumentId}")]
        [HttpGet]
        public IActionResult GetNewPhotos([FromRoute] long monumentId)
        {
            try
            {
                return Ok(photoService.GetNewPhotos(monumentId));
            }
            catch
            {
                return NotFound();
            }
        }

        [Route("getoldphotos/{monumentId}")]
        [HttpGet]
        public IActionResult GetOldPhotos([FromRoute] long monumentId)
        {
            try
            {
                return Ok(photoService.GetOldPhotos(monumentId));
            }
            catch
            {
                return NotFound();
            }
        }
    }
}