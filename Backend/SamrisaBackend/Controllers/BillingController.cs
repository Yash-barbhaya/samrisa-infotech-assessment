using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace SamrisaBackend.Controllers
{
    // 1. Define the Data Transfer Object (DTO) inside the file for easy access
    public class BillingSubmissionDto
    {
        [Required(ErrorMessage = "Full Name is required.")]
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string FullName { get; set; }

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Billing address is required.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Payment method selection is required.")]
        public string PaymentMethod { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Order total must be greater than 0.")]
        public decimal TotalAmount { get; set; }
    }

    // 2. The Core Web API Controller
    [ApiController]
    [Route("api/[controller]")]
    public class BillingController : ControllerBase
    {
        [HttpPost("checkout")] 
        public IActionResult ProcessCheckout([FromBody] BillingSubmissionDto model)
        {
            
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Validation failed on the server.",
                    errors = ModelState
                });
            }

            try
            {
              

                return Ok(new
                {
                    success = true,
                    message = $"Thank you, {model.FullName}! Your order has been successfully placed"
                });
            }
            catch (System.Exception)
            {

                return StatusCode(500, new
                {
                    success = false,
                    message = "An error occurred on the server while processing your checkout."
                });
            }
        }
    }
}