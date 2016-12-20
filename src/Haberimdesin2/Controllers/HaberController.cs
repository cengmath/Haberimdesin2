
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Haberimdesin2.Data;
using Haberimdesin2.Models;
using System.Xml;
using System.Net;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

/*

    / KATEGORILER STRING OLARAK SECILECEK
    / LIKE DISLIKE EKLENECEK
    COMMENT EKLENECEK

    TARIH EKLENECEK
    KULLANICI ADI EKLEDEICEK
 bU KADAR YETER SANIRIM BASKA b�s� yok evet
 su bg k�sm�na bakay�m sen tel�n� sarja koy

    */



namespace Haberimdesin2.Controllers
{
    public class HaberController : Controller
    {
        private IHttpContextAccessor _accessor;
        private readonly ApplicationDbContext _context;
        public IHostingEnvironment _environment;
        public UserManager<ApplicationUser> _user;
        public HaberController(ApplicationDbContext context, IHostingEnvironment environment, UserManager<ApplicationUser> user, IHttpContextAccessor accessor)
        {
            _context = context;
            _environment = environment;
            _user = user;
            _accessor = accessor;
        }
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var haberEntity = await _context.Haber.SingleOrDefaultAsync(m => m.HaberID == id);
            if (haberEntity == null)
            {
                return NotFound();
            }

            return View(haberEntity);
        }

        // GET: HaberEntities
        public async Task<IActionResult> Index()
        {
            /*
            var applicationDbContext = _context.Haber.Include(h => h.category).Include(h => h.user);
            return View(await applicationDbContext.ToListAsync());
            */

            var applicationDbContext = _context.Haber.OrderByDescending(i => i.TimeStamp).Take(3);

            return View(await applicationDbContext.ToListAsync());

        }


        // GET: HaberEntities/Create
        public IActionResult Create()
        {
            ViewData["CategoryID"] = new SelectList(_context.Category, "CategoryID", "CategoryID");
            ViewData["Id"] = new SelectList(_context.Users, "Id", "Id");
            return View();
        }

        //[HttpPost]
        //[Authorize]
        //[ValidateAntiForgeryToken]
        //public async Task<IActionResult> AddLike(HaberEntity haberEntity)
        //{
        //    haberEntity.
        //}



        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(HaberEntity haberEntity)
        {


            haberEntity.Detail = Request.Form["Detail"].ToString();
            haberEntity.HeadLine = Request.Form["HeadLine"].ToString();
            haberEntity.Title = Request.Form["Title"].ToString();
            haberEntity.Id = _user.GetUserId(User);
            //SONU�TA BA�TA L�KELER� SIFIR
            haberEntity.TimeStamp = DateTime.Now;
            var file = Request.Form.Files[0];

            string haberImgUrl = Path.Combine(new string[] { _environment.WebRootPath, "haberimage" });
            if (!Directory.Exists(haberImgUrl))
                Directory.CreateDirectory(haberImgUrl);
            using (var fileStream = new FileStream(Path.Combine(haberImgUrl, file.FileName), FileMode.Create))
            {
                haberEntity.PrimaryImgURL = "/haberimage/" + file.FileName;
                await file.CopyToAsync(fileStream);
            }
            /*
            if (true)
            {

                _context.Add(haberEntity);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index", "Home");
            }
            */
            ViewData["Id"] = new SelectList(_context.Users, "Id", "Id", haberEntity.Id);
            ViewData["CategoryID"] = new SelectList(_context.Category, "CategoryID", "CategoryID", haberEntity.CategoryID);
            return View(haberEntity);
        }

        //Hen�z kullan�lm�yor.
        public ActionResult SonUcHaber()
        {
            List<HaberEntity> sonBesMakaleList = new List<HaberEntity>();
            var sonbesmakale = _context.Haber;
            sonBesMakaleList = sonbesmakale.OrderByDescending(i => i.TimeStamp).Take(3).ToList();

            return PartialView(sonBesMakaleList);

        }




        // POST: HaberEntities/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.


        // GET: HaberEntities/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var haberEntity = await _context.Haber.SingleOrDefaultAsync(m => m.HaberID == id);
            if (haberEntity == null)
            {
                return NotFound();
            }
            ViewData["CategoryID"] = new SelectList(_context.Category, "CategoryID", "CategoryID", haberEntity.CategoryID);
            ViewData["Id"] = new SelectList(_context.Users, "Id", "Id", haberEntity.Id);
            return View(haberEntity);
        }

        // POST: HaberEntities/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("HaberID,CategoryID,Detail,HeadLine,Id,Latitude,Longitude,PrimaryImgURL,TimeStamp,Title")] HaberEntity haberEntity)
        {
            if (id != haberEntity.HaberID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(haberEntity);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!HaberEntityExists(haberEntity.HaberID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index", "Home");
            }
            ViewData["CategoryID"] = new SelectList(_context.Category, "CategoryID", "CategoryID", haberEntity.CategoryID);
            ViewData["Id"] = new SelectList(_context.Users, "Id", "Id", haberEntity.Id);
            return View(haberEntity);
        }

        // GET: HaberEntities/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var haberEntity = await _context.Haber.SingleOrDefaultAsync(m => m.HaberID == id);
            if (haberEntity == null)
            {
                return NotFound();
            }

            return View(haberEntity);
        }

        // POST: HaberEntities/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var haberEntity = await _context.Haber.SingleOrDefaultAsync(m => m.HaberID == id);
            _context.Haber.Remove(haberEntity);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index", "Home");
        }

        private bool HaberEntityExists(int id)
        {
            return _context.Haber.Any(e => e.HaberID == id);
        }
    }
}
