using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace Haberimdesin2.Controllers
{
    public class HaberimdesinController : Controller
    {
        // GET: Haberimdesin
        public ActionResult Index()
        {
            return View();
        }

        // GET: Haberimdesin/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: Haberimdesin/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Haberimdesin/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Haberimdesin/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Haberimdesin/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Haberimdesin/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Haberimdesin/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}