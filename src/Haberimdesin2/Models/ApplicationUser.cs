﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Haberimdesin2.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {

        
        public string ProfileImgURL { get; set; }
        
        public string Name { get; set; }
        
        public string Surname { get; set; }
        
        public byte Gender { get; set; }
        
        public DateTime BirthDate { get; set; }

        public String UserPass { get; set; }



    }
}
