using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.CORE.entities;

namespace Backend.CORE.Interfaces
{
    public interface IJwtTokenGenerator
    {
        string GenerateToken(Users user);

    }
}
