﻿namespace Vetheria.Vtedy.ApiService.Models
{
    public class Project
    {
        public int ProjectId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int UserAccountId { get; set; }
        public bool? IsDefault { get; set; }
    }
}
