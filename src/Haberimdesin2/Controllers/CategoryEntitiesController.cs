using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Haberimdesin2.Data;
using Haberimdesin2.Models;

namespace Haberimdesin2.Controllers
{
    public class CategoryEntitiesController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryEntitiesController(ApplicationDbContext context)
        {
            _context = context;    
        }

        // GET: CategoryEntities
        public async Task<IActionResult> Index()
        {
            return View(await _context.Category.ToListAsync());
        }

        // GET: CategoryEntities/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var categoryEntity = await _context.Category.SingleOrDefaultAsync(m => m.CategoryID == id);
            if (categoryEntity == null)
            {
                return NotFound();
            }

            return View(categoryEntity);
        }

        // GET: CategoryEntities/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: CategoryEntities/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CategoryID,Name")] CategoryEntity categoryEntity)
        {
            if (ModelState.IsValid)
            {
                _context.Add(categoryEntity);
                await _context.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(categoryEntity);
        }

        // GET: CategoryEntities/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var categoryEntity = await _context.Category.SingleOrDefaultAsync(m => m.CategoryID == id);
            if (categoryEntity == null)
            {
                return NotFound();
            }
            return View(categoryEntity);
        }

        // POST: CategoryEntities/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("CategoryID,Name")] CategoryEntity categoryEntity)
        {
            if (id != categoryEntity.CategoryID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(categoryEntity);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CategoryEntityExists(categoryEntity.CategoryID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction("Index");
            }
            return View(categoryEntity);
        }

        // GET: CategoryEntities/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var categoryEntity = await _context.Category.SingleOrDefaultAsync(m => m.CategoryID == id);
            if (categoryEntity == null)
            {
                return NotFound();
            }

            return View(categoryEntity);
        }

        // POST: CategoryEntities/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var categoryEntity = await _context.Category.SingleOrDefaultAsync(m => m.CategoryID == id);
            _context.Category.Remove(categoryEntity);
            await _context.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        private bool CategoryEntityExists(int id)
        {
            return _context.Category.Any(e => e.CategoryID == id);
        }
    }
}
