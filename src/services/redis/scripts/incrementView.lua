---@diagnostic disable: undefined-global

local itemsViewsKey = KEYS[1]
local itemsKey = KEYS[2]
local itemsByViewsKey = KEYS[3]

local itemId = ARGV[1]
local userId = ARGV[2]

local inserted = redis.call('PFADD', itemsViewsKey, userId)

if (inserted == 1) then
    redis.call('HINCRBY', itemsKey, 'views', 1)
    redis.call('ZINCRBY', itemsByViewsKey, 1, itemId)
    return 1
end

return 0
