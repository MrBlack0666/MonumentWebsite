using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Enums
{
    public enum SightseeingTime
    {
        [StringValue("Poniżej 2 godzin")]
        Under2h,
        [StringValue("Między 2, a 5 godzin")]
        Under5h,
        [StringValue("Dzień")]
        _1day,
        [StringValue("Między 2, a 5 dni")]
        Under5d,
        [StringValue("Tydzień")]
        _1week,
        [StringValue("Powyżej tygodnia")]
        Over1week
    }
}
